/*
DESIGN: Cyberpunk Tech Noir
- Deep dark backgrounds with electric cyan (#00d9ff) and magenta (#ff00aa) accents
- Angular diagonal sections with clip-path
- Glowing neon effects on interactive elements
- Orbitron for headings, Inter for body, JetBrains Mono for technical text
*/

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Cpu, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [currency, setCurrency] = useState("USD ($)");
  const [region, setRegion] = useState("United States");
  const [usage, setUsage] = useState("Gaming (High FPS)");
  const [includePeripherals, setIncludePeripherals] = useState(false);
  const [budget, setBudget] = useState("2000");

  const handleGenerateBuild = () => {
    if (!budget || parseFloat(budget) <= 0) {
      toast.error("Please enter a valid budget");
      return;
    }
    
    toast.success("Generating your custom PC build...", {
      description: "Our AI is analyzing the market for the best components",
    });
    
    // Simulate build generation
    setTimeout(() => {
      toast.info("Feature coming soon", {
        description: "Build generation will be available in the next update",
      });
    }, 2000);
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
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
                <Cpu className="w-6 h-6 text-background" />
              </div>
              <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                PCArchitect.ai
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Builder
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Saved Builds
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Get Pro
              </a>
              <a href="/feedback" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Feedback
              </a>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">{user?.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => logout()}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
                    onClick={() => window.location.href = getLoginUrl()}
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity neon-glow"
                    onClick={() => window.location.href = getLoginUrl()}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-6 neon-glow">
                <Cpu className="w-8 h-8 text-primary" />
              </div>
              <h1 
                className="text-4xl md:text-6xl font-bold mb-6 neon-text text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                AI PC Architect
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Tell us your budget and goals. Our AI will scour the market to engineer the perfect custom rig for you.
              </p>
            </div>

            {/* Form Card */}
            <div className="max-w-4xl mx-auto">
              <div 
                className="relative rounded-xl border border-primary/30 bg-card/50 backdrop-blur-md p-8 md:p-10"
                style={{
                  boxShadow: "0 0 40px rgba(0, 217, 255, 0.1), 0 0 80px rgba(255, 0, 170, 0.05)",
                }}
              >
                {/* Diagonal accent line */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-xl blur-3xl" />
                
                <div className="relative">
                  <h2 
                    className="text-2xl md:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Design Your Dream Machine
                  </h2>
                  <p className="text-sm text-muted-foreground mb-8">
                    AI-powered part picking based on real-time market data
                  </p>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Currency */}
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-sm font-medium">
                        Currency
                      </Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger 
                          id="currency"
                          className="bg-background/50 border-primary/30 focus:border-primary hover:border-primary/50 transition-colors"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD ($)">USD ($)</SelectItem>
                          <SelectItem value="EUR (€)">EUR (€)</SelectItem>
                          <SelectItem value="GBP (£)">GBP (£)</SelectItem>
                          <SelectItem value="JPY (¥)">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Region */}
                    <div className="space-y-2">
                      <Label htmlFor="region" className="text-sm font-medium">
                        Region
                      </Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger 
                          id="region"
                          className="bg-background/50 border-primary/30 focus:border-primary hover:border-primary/50 transition-colors"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="Japan">Japan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Primary Usage */}
                    <div className="space-y-2">
                      <Label htmlFor="usage" className="text-sm font-medium">
                        Primary Usage
                      </Label>
                      <Select value={usage} onValueChange={setUsage}>
                        <SelectTrigger 
                          id="usage"
                          className="bg-background/50 border-primary/30 focus:border-primary hover:border-primary/50 transition-colors"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gaming (High FPS)">Gaming (High FPS)</SelectItem>
                          <SelectItem value="Workstation (Editing/3D)">Workstation (Editing/3D)</SelectItem>
                          <SelectItem value="Office & Productivity">Office & Productivity</SelectItem>
                          <SelectItem value="Streaming & Gaming">Streaming & Gaming</SelectItem>
                          <SelectItem value="Programming & Dev">Programming & Dev</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Peripherals Checkbox */}
                  <div className="flex items-start space-x-3 mb-6 p-4 rounded-lg bg-background/30 border border-primary/20">
                    <Checkbox
                      id="peripherals"
                      checked={includePeripherals}
                      onCheckedChange={(checked) => setIncludePeripherals(checked as boolean)}
                      className="mt-0.5 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor="peripherals"
                      className="text-sm font-normal leading-relaxed cursor-pointer"
                    >
                      Include Peripherals (Monitor, Keyboard, Mouse, Headset) in budget
                    </Label>
                  </div>

                  {/* Budget Input */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-sm font-medium flex items-center gap-2">
                        <span className="text-primary">💰</span>
                        Maximum Budget
                      </Label>
                      <div className="relative">
                        <span 
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono"
                        >
                          $
                        </span>
                        <Input
                          id="budget"
                          type="number"
                          placeholder="2000"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="pl-8 h-12 bg-background/50 border-primary/30 focus:border-primary hover:border-primary/50 transition-colors text-lg font-mono"
                        />
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                      size="lg"
                      onClick={handleGenerateBuild}
                      className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 neon-glow group"
                    >
                      <Search className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      Generate Build
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary/20 backdrop-blur-sm bg-background/50 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="text-primary font-semibold">Base44 AI</span>
            </p>
            <a href="/feedback" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Share Feedback
            </a>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Prices are estimates based on current market data. Actual availability may vary.
          </p>
        </div>
      </footer>
    </div>
  );
}
