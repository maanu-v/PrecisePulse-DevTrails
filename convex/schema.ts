import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    deliveryPartnerId: v.optional(v.string()), // Delivery platform ID like Swiggy/Zomato
    deliveryPlatform: v.optional(v.string()), // E.g. "swiggy", "zomato"
    isOnboarded: v.boolean(),
  }).index("by_clerk_id", ["clerkId"]),
});
