import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Send, TrendingUp, Zap, Target, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

const OWNER_ID = 1; // Set this to the owner's user ID

export default function Feedback() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all feedbacks
  const { data: allFeedbacks = [], isLoading: isLoadingAll } = trpc.feedback.list.useQuery({
    limit: 50,
    offset: 0,
  });

  // Fetch user's feedbacks
  const { data: myFeedbacks = [], isLoading: isLoadingMy } = trpc.feedback.myFeedbacks.useQuery(
    { limit: 50, offset: 0 },
    { enabled: isAuthenticated }
  );

  const utils = trpc.useUtils();

  // Create feedback mutation
  const createFeedbackMutation = trpc.feedback.create.useMutation({
    onSuccess: () => {
      toast.success("Feedback submitted successfully!", {
        description: "Thank you for your input. Our AI is analyzing it now.",
      });
      setName("");
      setEmail("");
      setCategory("general");
      setMessage("");
      setIsSubmitting(false);
      utils.feedback.list.invalidate();
      utils.feedback.myFeedbacks.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to submit feedback", {
        description: error.message,
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    await createFeedbackMutation.mutateAsync({
      name,
      email,
      category: category as any,
      message,
    });
  };

  const FeedbackCard = ({ feedback }: { feedback: any }) => {
    const isOwner = user?.id === OWNER_ID;
    const isFeatureRequest = feedback.category === "feature";
    const frequencyScore = feedback.frequency ? parseFloat(feedback.frequency) : 0;
    const feasibilityScore = feedback.feasibility ? parseFloat(feedback.feasibility) : 0;
    const impactScore = feedback.impact ? parseFloat(feedback.impact) : 0;

    // Fetch reaction counts
    const { data: reactionCounts = { likes: 0, dislikes: 0 } } = trpc.feedback.getReactionCounts.useQuery({
      feedbackId: feedback.id,
    });

    // Fetch user's reaction if authenticated
    const { data: userReaction = null } = trpc.feedback.getMyReaction.useQuery(
      { feedbackId: feedback.id },
      { enabled: isAuthenticated }
    );

    // React mutation
    const reactMutation = trpc.feedback.react.useMutation({
      onSuccess: () => {
        utils.feedback.getReactionCounts.invalidate({ feedbackId: feedback.id });
        utils.feedback.getMyReaction.invalidate({ feedbackId: feedback.id });
      },
    });

    // Unreact mutation
    const unreactMutation = trpc.feedback.unreact.useMutation({
      onSuccess: () => {
        utils.feedback.getReactionCounts.invalidate({ feedbackId: feedback.id });
        utils.feedback.getMyReaction.invalidate({ feedbackId: feedback.id });
      },
    });

    const handleLike = async () => {
      if (!isAuthenticated) {
        window.location.href = getLoginUrl();
        return;
      }

      if (userReaction === "like") {
        await unreactMutation.mutateAsync({ feedbackId: feedback.id });
      } else {
        await reactMutation.mutateAsync({ feedbackId: feedback.id, type: "like" });
      }
    };

    const handleDislike = async () => {
      if (!isAuthenticated) {
        window.location.href = getLoginUrl();
        return;
      }

      if (userReaction === "dislike") {
        await unreactMutation.mutateAsync({ feedbackId: feedback.id });
      } else {
        await reactMutation.mutateAsync({ feedbackId: feedback.id, type: "dislike" });
      }
    };

    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{feedback.name}</CardTitle>
              <CardDescription>{feedback.email}</CardDescription>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
              {feedback.category}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground">{feedback.message}</p>

          {/* Like/Dislike Buttons - Visible to all users */}
          <div className="flex items-center gap-2 pt-4 border-t border-primary/10">
            <Button
              size="sm"
              variant={userReaction === "like" ? "default" : "outline"}
              onClick={handleLike}
              disabled={reactMutation.isPending || unreactMutation.isPending}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              {reactionCounts.likes}
            </Button>
            <Button
              size="sm"
              variant={userReaction === "dislike" ? "default" : "outline"}
              onClick={handleDislike}
              disabled={reactMutation.isPending || unreactMutation.isPending}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              {reactionCounts.dislikes}
            </Button>
          </div>

          {/* AI Analysis Scores - Only visible to owner and only for feature requests */}
          {isOwner && isFeatureRequest && (frequencyScore > 0 || feasibilityScore > 0 || impactScore > 0) && (
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">Frequency</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                    style={{ width: `${frequencyScore * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{(frequencyScore * 100).toFixed(0)}%</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">Feasibility</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                    style={{ width: `${feasibilityScore * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{(feasibilityScore * 100).toFixed(0)}%</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">Impact</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                    style={{ width: `${impactScore * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{(impactScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {new Date(feedback.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/images/hero-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.3,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-primary/20 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              PCArchitect.ai
            </span>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h1
                  className="text-4xl md:text-5xl font-bold mb-4 neon-text text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Community Feedback
                </h1>
                <p className="text-lg text-muted-foreground">
                  Share your thoughts and see how the community is shaping PC Architect
                </p>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-background/50 border border-primary/20">
                  <TabsTrigger value="all">All Feedbacks</TabsTrigger>
                  <TabsTrigger value="submit" disabled={!isAuthenticated}>
                    {isAuthenticated ? "Submit Feedback" : "Sign in to Submit"}
                  </TabsTrigger>
                </TabsList>

                {/* All Feedbacks Tab */}
                <TabsContent value="all" className="space-y-4">
                  {isLoadingAll ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Loading feedbacks...</p>
                    </div>
                  ) : allFeedbacks.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No feedbacks yet. Be the first to share!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {allFeedbacks.map((feedback) => (
                        <FeedbackCard key={feedback.id} feedback={feedback} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Submit Feedback Tab */}
                <TabsContent value="submit" className="space-y-6">
                  {!isAuthenticated ? (
                    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Sign in to Submit Feedback</CardTitle>
                        <CardDescription>
                          You need to be logged in to submit feedback
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => window.location.href = getLoginUrl()}
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        >
                          Sign In
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {/* Feedback Form */}
                      <div
                        className="relative rounded-xl border border-primary/30 bg-card/50 backdrop-blur-md p-8"
                        style={{
                          boxShadow: "0 0 40px rgba(0, 217, 255, 0.1), 0 0 80px rgba(255, 0, 170, 0.05)",
                        }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-xl blur-3xl" />

                        <form onSubmit={handleSubmit} className="relative space-y-6">
                          {/* Name Field */}
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                              Your Name
                            </Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder={user?.name || "John Doe"}
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="bg-background/50 border-primary/30 focus:border-primary hover:border-primary/50 transition-colors"
                            />
                          </div>

                          {/* Email Field */}
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                              Email Address
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder={user?.email || "john@example.com"}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="bg-background/50 border-primary/30 focus:border-primary hover:border-primary/50 transition-colors"
                            />
                          </div>

                          {/* Category Select */}
                          <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-medium">
                              Feedback Category
                            </Label>
                            <Select value={category} onValueChange={setCategory}>
                              <SelectTrigger
                                id="category"
                                className="bg-background/50 border-primary/30 focus:border-primary hover:border-primary/50 transition-colors"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">General Feedback</SelectItem>
                                <SelectItem value="bug">Bug Report</SelectItem>
                                <SelectItem value="feature">Feature Request</SelectItem>
                                <SelectItem value="performance">Performance Issue</SelectItem>
                                <SelectItem value="ui">UI/UX Suggestion</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Message Field */}
                          <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm font-medium">
                              Your Message
                            </Label>
                            <Textarea
                              id="message"
                              placeholder="Tell us what you think..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              rows={6}
                              className="bg-background/50 border-primary/30 focus:border-primary hover:border-primary/50 transition-colors resize-none"
                            />
                          </div>

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 neon-glow disabled:opacity-50"
                          >
                            <Send className="w-5 h-5 mr-2" />
                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                          </Button>
                        </form>
                      </div>

                      {/* My Feedbacks */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">Your Feedbacks</h3>
                        {isLoadingMy ? (
                          <p className="text-muted-foreground">Loading your feedbacks...</p>
                        ) : myFeedbacks.length === 0 ? (
                          <p className="text-muted-foreground">You haven't submitted any feedback yet.</p>
                        ) : (
                          <div className="grid gap-4">
                            {myFeedbacks.map((feedback) => (
                              <FeedbackCard key={feedback.id} feedback={feedback} />
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary/20 backdrop-blur-sm bg-background/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Like or dislike feedback to help prioritize improvements. Feature requests are analyzed for frequency, feasibility, and impact.
          </p>
        </div>
      </footer>
    </div>
  );
}
