import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';



export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    picture: v.string(),
    clerkId: v.string(),
    uid: v.string(),
  }).index("by_email", ["email"]),
});