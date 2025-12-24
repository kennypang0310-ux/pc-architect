import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createFeedback, getAllFeedbacks, getFeedbacksByUserId, updateFeedbackAnalysis, addFeedbackReaction, removeFeedbackReaction, getFeedbackReactionCounts, getUserReaction } from "./db";
import { invokeLLM } from "./_core/llm";
import { healthCheck, listRobots, getPriceFromRetailers } from "./services/browseAi";

async function analyzeFeedbackWithAI(feedbackId: number, message: string, category: string) {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes user feedback for a PC Builder application. 
          Analyze the feedback and provide scores for:
          1. Frequency: How common is this type of feedback (0-1, where 1 is very common)
          2. Feasibility: How feasible is it to implement (0-1, where 1 is very feasible)
          3. Impact: How much impact would implementing this have (0-1, where 1 is very high impact)
          
          Return a JSON object with these scores and a brief analysis.`,
        },
        {
          role: "user",
          content: `Analyze this feedback (category: ${category}): "${message}"`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "feedback_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              frequency: { type: "number", description: "Frequency score 0-1" },
              feasibility: { type: "number", description: "Feasibility score 0-1" },
              impact: { type: "number", description: "Impact score 0-1" },
              reasoning: { type: "string", description: "Brief explanation of scores" },
            },
            required: ["frequency", "feasibility", "impact", "reasoning"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    if (!content) throw new Error("No response from LLM");

    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const analysis = JSON.parse(contentStr);
    
    await updateFeedbackAnalysis(feedbackId, {
      frequency: Math.max(0, Math.min(1, analysis.frequency)),
      feasibility: Math.max(0, Math.min(1, analysis.feasibility)),
      impact: Math.max(0, Math.min(1, analysis.impact)),
      aiAnalysis: analysis,
    });
  } catch (error) {
    console.error("[AI Analysis] Failed to analyze feedback:", error);
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  feedback: router({
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          category: z.enum(["general", "bug", "feature", "performance", "ui", "other"]),
          message: z.string().min(10),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const feedback = await createFeedback({
          userId: ctx.user.id,
          name: input.name,
          email: input.email,
          category: input.category,
          message: input.message,
        });

        if (!feedback) {
          throw new Error("Failed to create feedback");
        }

        analyzeFeedbackWithAI(feedback.id, input.message, input.category).catch(err =>
          console.error("[AI Analysis] Failed to analyze feedback:", err)
        );

        return feedback;
      }),

    list: publicProcedure
      .input(
        z.object({
          limit: z.number().int().min(1).max(100).default(20),
          offset: z.number().int().min(0).default(0),
        })
      )
      .query(async ({ input }) => {
        return await getAllFeedbacks(input.limit, input.offset);
      }),

    myFeedbacks: protectedProcedure
      .input(
        z.object({
          limit: z.number().int().min(1).max(100).default(20),
          offset: z.number().int().min(0).default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getFeedbacksByUserId(ctx.user.id, input.limit, input.offset);
      }),

    react: protectedProcedure
      .input(
        z.object({
          feedbackId: z.number().int(),
          type: z.enum(["like", "dislike"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const success = await addFeedbackReaction(input.feedbackId, ctx.user.id, input.type);
        if (!success) throw new Error("Failed to add reaction");
        const counts = await getFeedbackReactionCounts(input.feedbackId);
        return counts;
      }),

    unreact: protectedProcedure
      .input(z.object({ feedbackId: z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        const success = await removeFeedbackReaction(input.feedbackId, ctx.user.id);
        if (!success) throw new Error("Failed to remove reaction");
        const counts = await getFeedbackReactionCounts(input.feedbackId);
        return counts;
      }),

    getReactionCounts: publicProcedure
      .input(z.object({ feedbackId: z.number().int() }))
      .query(async ({ input }) => {
        return await getFeedbackReactionCounts(input.feedbackId);
      }),

    getMyReaction: protectedProcedure
      .input(z.object({ feedbackId: z.number().int() }))
      .query(async ({ ctx, input }) => {
        return await getUserReaction(input.feedbackId, ctx.user.id);
      }),
  }),

  prices: router({
    checkBrowseAiConnection: publicProcedure.query(async () => {
      try {
        const isHealthy = await healthCheck();
        return { connected: isHealthy, status: isHealthy ? "Connected" : "Disconnected" };
      } catch (error) {
        return { connected: false, status: "Error", error: String(error) };
      }
    }),

    listAvailableRobots: publicProcedure.query(async () => {
      try {
        const robots = await listRobots();
        return { robots, count: robots.length };
      } catch (error) {
        return { robots: [], count: 0, error: String(error) };
      }
    }),

    scrapeComponentPrices: publicProcedure
      .input(
        z.object({
          componentType: z.string(),
          componentName: z.string(),
          region: z.string(),
          retailers: z.record(z.string(), z.string()), // Map of retailer name to robot ID
        })
      )
      .query(async ({ input }) => {
        try {
          const prices = await getPriceFromRetailers(
            input.componentType,
            input.componentName,
            input.region,
            input.retailers as Record<string, string>
          );
          return { prices, success: true };
        } catch (error) {
          return { prices: [], success: false, error: String(error) };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
