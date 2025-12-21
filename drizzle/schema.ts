import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Feedbacks table for storing user feedback about the PC Architect application
 */
export const feedbacks = mysqlTable("feedbacks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  category: mysqlEnum("category", [
    "general",
    "bug",
    "feature",
    "performance",
    "ui",
    "other",
  ]).notNull(),
  message: text("message").notNull(),
  
  // AI Analysis Fields
  frequency: decimal("frequency", { precision: 3, scale: 2 }), // 0-1.00 scale
  feasibility: decimal("feasibility", { precision: 3, scale: 2 }), // 0-1.00 scale
  impact: decimal("impact", { precision: 3, scale: 2 }), // 0-1.00 scale
  aiAnalysis: json("aiAnalysis"), // Store detailed AI analysis as JSON
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;

/**
 * Feedback reactions (likes/dislikes) table
 */
export const feedbackReactions = mysqlTable("feedbackReactions", {
  id: int("id").autoincrement().primaryKey(),
  feedbackId: int("feedbackId").notNull(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["like", "dislike"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FeedbackReaction = typeof feedbackReactions.$inferSelect;
export type InsertFeedbackReaction = typeof feedbackReactions.$inferInsert;