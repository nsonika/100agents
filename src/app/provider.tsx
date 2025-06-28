"use client";
import React, { createContext, useEffect, useState } from 'react';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from "@clerk/nextjs";

// Define context types
type UserDetailContextType = {
  userDetail: any;
  setUserDetail: React.Dispatch<React.SetStateAction<any>>;
};

type MessagesContextType = {
  messages: any;
  setMessages: React.Dispatch<React.SetStateAction<any>>;
};

type ActionContextType = {
  action: any;
  setAction: React.Dispatch<React.SetStateAction<any>>;
};

// Define contexts directly in provider file with default values
export const UserDetailContext = createContext<UserDetailContextType>({
  userDetail: null,
  setUserDetail: () => {}
});

export const MessagesContext = createContext<MessagesContextType>({
  messages: null,
  setMessages: () => {}
});

export const ActionContext = createContext<ActionContextType>({
  action: null,
  setAction: () => {}
});



function Provider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<any>(null);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [action, setAction] = useState<any>(null);
  const router = useRouter();
  const convex = useConvex();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        fetchUserDetails(userId);
      } else {
        // Clear user details when logged out
        setUserDetail(null);
      }
    }
  }, [isLoaded, userId]);

  const fetchUserDetails = async (id: string) => {
    if (!id || !user) return;
    
    try {
      // Fetch user from the database using Clerk userId
      const result = await convex.query(api.users.GetUser, {
        email: id,
      });
      
      if (result) {
        setUserDetail(result);
        
        // Update user details if they've changed
        if (user.emailAddresses && user.emailAddresses.length > 0) {
          const primaryEmail = user.emailAddresses[0].emailAddress;
          const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
          
          if (result.email !== primaryEmail || result.name !== fullName) {
            await convex.mutation(api.users.UpdateUser, {
              id: result._id,
              email: primaryEmail,
              name: fullName,
              picture: user.imageUrl || '',
            });
          }
        }
      } else {
        console.log("User not found in database, creating new user...");
        
        // Create a new user in Convex if not found
        try {
          if (userId && user) {
            const primaryEmail = user.emailAddresses && user.emailAddresses.length > 0 
              ? user.emailAddresses[0].emailAddress 
              : id;
              
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
            
            // Create user in Convex
            const newUser = await convex.mutation(api.users.CreateUser, {
              email: primaryEmail,
              name: fullName,
              picture: user.imageUrl || '',
              uid: id,
              clerkId: id,
            });
            
            setUserDetail(newUser);
          }
        } catch (createError) {
          console.error("Error creating user:", createError);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <MessagesContext.Provider value={{ messages, setMessages }}>
          <ActionContext.Provider value={{ action, setAction }}>
            <main className="w-full">
              {children}
            </main>
          </ActionContext.Provider>
        </MessagesContext.Provider>
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;
