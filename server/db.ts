import { eq, desc, and, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, feedbacks, InsertFeedback, Feedback, feedbackReactions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createFeedback(feedback: InsertFeedback): Promise<Feedback | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create feedback: database not available");
    return null;
  }

  try {
    const result = await db.insert(feedbacks).values(feedback);
    const insertedId = result[0]?.insertId;
    if (!insertedId) return null;
    
    const created = await db.select().from(feedbacks).where(eq(feedbacks.id, insertedId as number)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create feedback:", error);
    return null;
  }
}

export async function getAllFeedbacks(limit = 50, offset = 0): Promise<Feedback[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get feedbacks: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(feedbacks)
      .orderBy(desc(feedbacks.createdAt))
      .limit(limit)
      .offset(offset);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get feedbacks:", error);
    return [];
  }
}

export async function getFeedbacksByUserId(userId: number, limit = 50, offset = 0): Promise<Feedback[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user feedbacks: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(feedbacks)
      .where(eq(feedbacks.userId, userId))
      .orderBy(desc(feedbacks.createdAt))
      .limit(limit)
      .offset(offset);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user feedbacks:", error);
    return [];
  }
}

export async function updateFeedbackAnalysis(
  feedbackId: number,
  analysis: { frequency: number; feasibility: number; impact: number; aiAnalysis: unknown }
): Promise<Feedback | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update feedback: database not available");
    return null;
  }

  try {
    await db
      .update(feedbacks)
      .set({
        frequency: analysis.frequency.toString(),
        feasibility: analysis.feasibility.toString(),
        impact: analysis.impact.toString(),
        aiAnalysis: analysis.aiAnalysis,
      })
      .where(eq(feedbacks.id, feedbackId));

    const updated = await db.select().from(feedbacks).where(eq(feedbacks.id, feedbackId)).limit(1);
    return updated.length > 0 ? updated[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update feedback:", error);
    return null;
  }
}

export async function addFeedbackReaction(
  feedbackId: number,
  userId: number,
  type: "like" | "dislike"
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add reaction: database not available");
    return false;
  }

  try {
    const existing = await db
      .select()
      .from(feedbackReactions)
      .where(
        and(
          eq(feedbackReactions.feedbackId, feedbackId),
          eq(feedbackReactions.userId, userId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(feedbackReactions)
        .set({ type })
        .where(
          and(
            eq(feedbackReactions.feedbackId, feedbackId),
            eq(feedbackReactions.userId, userId)
          )
        );
    } else {
      await db.insert(feedbackReactions).values({
        feedbackId,
        userId,
        type,
      });
    }
    return true;
  } catch (error) {
    console.error("[Database] Failed to add reaction:", error);
    return false;
  }
}

export async function removeFeedbackReaction(
  feedbackId: number,
  userId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot remove reaction: database not available");
    return false;
  }

  try {
    await db
      .delete(feedbackReactions)
      .where(
        and(
          eq(feedbackReactions.feedbackId, feedbackId),
          eq(feedbackReactions.userId, userId)
        )
      );
    return true;
  } catch (error) {
    console.error("[Database] Failed to remove reaction:", error);
    return false;
  }
}

export async function getFeedbackReactionCounts(feedbackId: number): Promise<{ likes: number; dislikes: number }> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get reaction counts: database not available");
    return { likes: 0, dislikes: 0 };
  }

  try {
    const likes = await db
      .select({ count: count() })
      .from(feedbackReactions)
      .where(
        and(
          eq(feedbackReactions.feedbackId, feedbackId),
          eq(feedbackReactions.type, "like")
        )
      );

    const dislikes = await db
      .select({ count: count() })
      .from(feedbackReactions)
      .where(
        and(
          eq(feedbackReactions.feedbackId, feedbackId),
          eq(feedbackReactions.type, "dislike")
        )
      );

    return {
      likes: likes[0]?.count || 0,
      dislikes: dislikes[0]?.count || 0,
    };
  } catch (error) {
    console.error("[Database] Failed to get reaction counts:", error);
    return { likes: 0, dislikes: 0 };
  }
}

export async function getUserReaction(
  feedbackId: number,
  userId: number
): Promise<"like" | "dislike" | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user reaction: database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(feedbackReactions)
      .where(
        and(
          eq(feedbackReactions.feedbackId, feedbackId),
          eq(feedbackReactions.userId, userId)
        )
      )
      .limit(1);

    return result.length > 0 ? result[0].type : null;
  } catch (error) {
    console.error("[Database] Failed to get user reaction:", error);
    return null;
  }
}
