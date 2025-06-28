"use client";

import { SignInButton, SignUpButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { WavyBackground } from "@/components/ui/wavy-background";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Link from "next/link";
import { useContext } from "react";
import { useState } from "react";
import { MessagesContext } from "./provider";
// Import useRouter from next/navigation instead of next/router in Next.js 13+
import { useRouter } from "next/navigation";
import { UserDetailContext } from "./provider";

export default function Home() {
  const [userInput, setUserInput] = useState<string>("");
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { isSignedIn, user } = useUser();

  const router = useRouter();
  
  const onGenerate = async (input: string) => {
    if (!input) return;
    
    // Add the user message to the messages context
    setMessages((prev: any) => [...(prev || []), {
      role: 'user',
      content: input,
    }]);
    
    // Here you can add logic to process the input, like sending to an API
    console.log("Processing input:", input);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0f1a25] to-black
">
      {/* Navigation Bar */}
      <nav className="w-full flex items-center justify-between px-6 py-4 absolute top-0 z-50">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          <span className="text-white text-xl font-bold">100Agents hackathon</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button variant="outline" className="bg-transparent text-white border border-white/20 hover:border-white hover:bg-white/10 transition">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button className="bg-white text-black font-medium hover:bg-neutral-100 transition">
                  Get Started
                </Button>
              </SignUpButton>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mr-4">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  {user?.imageUrl ? (
                    <Image 
                      src={user.imageUrl} 
                      alt="Profile" 
                      width={32} 
                      height={32} 
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xs text-white">{user?.firstName?.[0] || 'U'}</span>
                  )}
                </div>
                <span className="text-white">{user?.firstName || 'User'}</span>
              </div>
              
              <SignOutButton>
                <Button variant="outline" className="bg-transparent text-white border border-white/20 hover:border-white hover:bg-white/10 transition">
                  Sign Out
                </Button>
              </SignOutButton>
            </>
          )}
        </div>
      </nav>
      
      <WavyBackground 
        className="max-w-4xl mx-auto px-8 w-full text-center" 
        colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]} 
        waveWidth={100} 
        backgroundFill="black"
        blur={10}
        speed="slow"
        waveOpacity={0.6}
      >
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl mx-auto mb-12">
          Turn any idea into a working web app
          </h1>

          
          <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-2xl mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 blur-3xl rounded-3xl"></div>
              <div className="dark scale-125 transform py-4 filter drop-shadow-[0_0_15px_rgba(79,70,229,0.15)] relative z-10">
                <PlaceholdersAndVanishInput 
                  placeholders={[
                    "Create a habit tracker app...",
                    "Build a Spotify clone...",
                    "Design an e-commerce store...",
                    "Make an AI study buddy...",
                    "Create a personal portfolio..."
                  ]}
                  onChange={(e) => setUserInput(e.target.value)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Only process if we have input
                    if (userInput.trim()) {
                      onGenerate(userInput);
                      // Clear the input after submission
                      setUserInput("");
                    }
                    console.log("Submitted form");
                  }}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                To Do List
              </Button>
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
               Notes App
              </Button>
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
               Spotify Clone
              </Button>
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                AI Study Buddy
              </Button>
            </div>
          </div>

          {/* Buttons are now in the nav bar */}
        </div>
      </WavyBackground>
    </main>
  );
}
