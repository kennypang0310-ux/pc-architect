/*
DESIGN: Cyberpunk Tech Noir
- Consistent with home page design
- Dark backgrounds with cyan/magenta accents
- Glowing neon effects
*/

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
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Feedback() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Feedback submitted successfully!", {
        description: "Thank you for your input. We'll review it shortly.",
      });
      setName("");
      setEmail("");
      setCategory("general");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with cyberpunk circuit pattern */}
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
        {/* Overlay gradient for depth */}
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
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h1
                  className="text-4xl md:text-5xl font-bold mb-4 neon-text text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Send Us Your Feedback
                </h1>
                <p className="text-lg text-muted-foreground">
                  Help us improve PC Architect by sharing your thoughts and suggestions
                </p>
              </div>

              {/* Feedback Form Card */}
              <div
                className="relative rounded-xl border border-primary/30 bg-card/50 backdrop-blur-md p-8"
                style={{
                  boxShadow: "0 0 40px rgba(0, 217, 255, 0.1), 0 0 80px rgba(255, 0, 170, 0.05)",
                }}
              >
                {/* Accent gradients */}
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
                      placeholder="John Doe"
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
                      placeholder="john@example.com"
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

              {/* Info Section */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-primary text-2xl mb-2">💡</div>
                  <h3 className="font-semibold mb-2">Ideas Welcome</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your feature ideas and help shape the future of PC Architect
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl mb-2">🐛</div>
                  <h3 className="font-semibold mb-2">Report Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    Found a bug? Let us know so we can fix it quickly
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl mb-2">⭐</div>
                  <h3 className="font-semibold mb-2">Share Praise</h3>
                  <p className="text-sm text-muted-foreground">
                    Loving PC Architect? Tell us what's working well
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary/20 backdrop-blur-sm bg-background/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            We value your feedback and use it to improve PC Architect
          </p>
        </div>
      </footer>
    </div>
  );
}
