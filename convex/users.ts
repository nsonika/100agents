import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const registerUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, name, clerkId, picture, uid } = args;
    return await ctx.db.insert("users", {
      email,
      name,
      clerkId,
      picture,
      uid,
    });
  },
});

// Add GetUser query function to retrieve user by email
export const GetUser = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { email } = args;
    
    // If no email provided, return null
    if (!email) {
      return null;
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    return user;
  },
});

// Add CreateUser mutation for Clerk sign-in
export const CreateUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    picture: v.string(),
    clerkId: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, name, picture, clerkId, uid } = args;
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (existingUser) {
      return existingUser;
    }
    
    // Create new user
    return await ctx.db.insert("users", {
      email,
      name,
      picture,
      clerkId,
      uid,
    });
  },
  
});

// Add UpdateUser mutation to update user information
export const UpdateUser = mutation({
  args: {
    id: v.id("users"),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    picture: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, email, name, picture } = args;
    
    // Create update object with only the fields that are provided
    const updateObj: any = {};
    if (email !== undefined) updateObj.email = email;
    if (name !== undefined) updateObj.name = name;
    if (picture !== undefined) updateObj.picture = picture;
    
    // Update the user
    await ctx.db.patch(id, updateObj);
    
    // Return the updated user
    return await ctx.db.get(id);
  },
});
