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
import { Checkbox } from "@/components/ui/checkbox";
import { Cpu, Search, ChevronsUpDown, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "JPY", label: "JPY (¥)", symbol: "¥" },
  { value: "CAD", label: "CAD (C$)", symbol: "C$" },
  { value: "AUD", label: "AUD (A$)", symbol: "A$" },
  { value: "CHF", label: "CHF (CHF)", symbol: "CHF" },
  { value: "CNY", label: "CNY (¥)", symbol: "¥" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "BRL", label: "BRL (R$)", symbol: "R$" },
  { value: "MXN", label: "MXN (Mex$)", symbol: "Mex$" },
  { value: "SGD", label: "SGD (S$)", symbol: "S$" },
  { value: "HKD", label: "HKD (HK$)", symbol: "HK$" },
  { value: "NZD", label: "NZD (NZ$)", symbol: "NZ$" },
  { value: "SEK", label: "SEK (kr)", symbol: "kr" },
  { value: "NOK", label: "NOK (kr)", symbol: "kr" },
  { value: "DKK", label: "DKK (kr)", symbol: "kr" },
  { value: "ZAR", label: "ZAR (R)", symbol: "R" },
  { value: "KRW", label: "KRW (₩)", symbol: "₩" },
  { value: "TWD", label: "TWD (NT$)", symbol: "NT$" },
  { value: "THB", label: "THB (฿)", symbol: "฿" },
  { value: "MYR", label: "MYR (RM)", symbol: "RM" },
  { value: "PHP", label: "PHP (₱)", symbol: "₱" },
  { value: "IDR", label: "IDR (Rp)", symbol: "Rp" },
  { value: "VND", label: "VND (₫)", symbol: "₫" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" },
  { value: "BDT", label: "BDT (৳)", symbol: "৳" },
  { value: "TRY", label: "TRY (₺)", symbol: "₺" },
  { value: "RUB", label: "RUB (₽)", symbol: "₽" },
  { value: "PLN", label: "PLN (zł)", symbol: "zł" },
  { value: "CZK", label: "CZK (Kč)", symbol: "Kč" },
  { value: "HUF", label: "HUF (Ft)", symbol: "Ft" },
  { value: "RON", label: "RON (lei)", symbol: "lei" },
  { value: "BGN", label: "BGN (лв)", symbol: "лв" },
  { value: "HRK", label: "HRK (kn)", symbol: "kn" },
  { value: "RSD", label: "RSD (дин)", symbol: "дин" },
  { value: "UAH", label: "UAH (₴)", symbol: "₴" },
  { value: "AED", label: "AED (د.إ)", symbol: "د.إ" },
  { value: "SAR", label: "SAR (﷼)", symbol: "﷼" },
  { value: "QAR", label: "QAR (﷼)", symbol: "﷼" },
  { value: "KWD", label: "KWD (د.ك)", symbol: "د.ك" },
  { value: "BHD", label: "BHD (د.ب)", symbol: "د.ب" },
  { value: "OMR", label: "OMR (ر.ع.)", symbol: "ر.ع." },
  { value: "JOD", label: "JOD (د.ا)", symbol: "د.ا" },
  { value: "ILS", label: "ILS (₪)", symbol: "₪" },
  { value: "EGP", label: "EGP (£)", symbol: "£" },
  { value: "NGN", label: "NGN (₦)", symbol: "₦" },
  { value: "GHS", label: "GHS (₵)", symbol: "₵" },
  { value: "KES", label: "KES (Sh)", symbol: "Sh" },
  { value: "CLP", label: "CLP ($)", symbol: "$" },
  { value: "ARS", label: "ARS ($)", symbol: "$" },
  { value: "COP", label: "COP ($)", symbol: "$" },
  { value: "PEN", label: "PEN (S/)", symbol: "S/" },
  { value: "UYU", label: "UYU ($U)", symbol: "$U" },
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Bulgaria",
  "Croatia",
  "Serbia",
  "Ukraine",
  "Greece",
  "Portugal",
  "Austria",
  "Ireland",
  "Japan",
  "South Korea",
  "China",
  "India",
  "Australia",
  "New Zealand",
  "Brazil",
  "Mexico",
  "Singapore",
  "Hong Kong",
  "Taiwan",
  "Thailand",
  "Malaysia",
  "Philippines",
  "Indonesia",
  "Vietnam",
  "Pakistan",
  "Bangladesh",
  "Turkey",
  "Russia",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Jordan",
  "Israel",
  "Egypt",
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Chile",
  "Argentina",
  "Colombia",
  "Peru",
  "Uruguay",
  "Venezuela",
  "Ecuador",
  "Guatemala",
  "Costa Rica",
  "Panama",
  "Dominican Republic",
  "Jamaica",
  "Trinidad and Tobago",
  "Iceland",
  "Luxembourg",
  "Malta",
  "Cyprus",
  "Slovenia",
  "Slovakia",
  "Lithuania",
  "Latvia",
  "Estonia",
];

const USAGE_TYPES = [
  "Gaming (High FPS)",
  "Gaming (High Settings)",
  "Workstation (3D Rendering)",
  "Workstation (Video Editing)",
  "Office & Productivity",
  "Streaming Setup",
  "Programming & Development",
  "Content Creation",
  "Data Science & ML",
  "Budget Build",
];

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const [currency, setCurrency] = useState("USD ($)");
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [region, setRegion] = useState("United States");
  const [usage, setUsage] = useState("Gaming (High FPS)");
  const [includePeripherals, setIncludePeripherals] = useState(false);
  const [budget, setBudget] = useState("2000");
  const [isGenerating, setIsGenerating] = useState(false);

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [usageOpen, setUsageOpen] = useState(false);

  const handleGenerateBuild = () => {
    if (!budget || parseFloat(budget) <= 0) {
      toast.error("Please enter a valid budget");
      return;
    }

    setIsGenerating(true);
    toast.success("Generating your perfect PC build...");

    setTimeout(() => {
      setIsGenerating(false);
      const buildParams = {
        currency,
        region,
        usage,
        includePeripherals,
        budget: parseFloat(budget),
      };
      sessionStorage.setItem("buildParams", JSON.stringify(buildParams));
      setLocation("/build-results");
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
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline">{user.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.location.href = `${getLoginUrl()}?logout=true`;
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.location.href = getLoginUrl();
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      window.location.href = getLoginUrl();
                    }}
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
                    {/* Currency Combobox */}
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                      <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={currencyOpen}
                            className="w-full justify-between bg-background/50 border-primary/30 hover:border-primary/50 text-sm"
                          >
                            {currency}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search currency..." />
                            <CommandEmpty>No currency found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {CURRENCIES.map((curr) => (
                                  <CommandItem
                                    key={curr.value}
                                    value={curr.label}
                                    onSelect={(currentValue) => {
                                      setCurrency(currentValue === currency ? "" : currentValue);
                                      const curr = CURRENCIES.find((c) => c.label === currentValue) || CURRENCIES[0];
                                      setSelectedCurrency(curr);
                                      setCurrencyOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        currency === curr.label ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {curr.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Region Combobox */}
                    <div className="space-y-2">
                      <Label htmlFor="region" className="text-sm font-medium">Region / Country</Label>
                      <Popover open={regionOpen} onOpenChange={setRegionOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={regionOpen}
                            className="w-full justify-between bg-background/50 border-primary/30 hover:border-primary/50 text-sm"
                          >
                            {region}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search region..." />
                            <CommandEmpty>No region found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {COUNTRIES.map((country) => (
                                  <CommandItem
                                    key={country}
                                    value={country}
                                    onSelect={(currentValue) => {
                                      setRegion(currentValue === region ? "" : currentValue);
                                      setRegionOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        region === country ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {country}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Usage Combobox */}
                    <div className="space-y-2">
                      <Label htmlFor="usage" className="text-sm font-medium">Primary Usage</Label>
                      <Popover open={usageOpen} onOpenChange={setUsageOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={usageOpen}
                            className="w-full justify-between bg-background/50 border-primary/30 hover:border-primary/50 text-sm"
                          >
                            {usage}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search usage..." />
                            <CommandEmpty>No usage found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {USAGE_TYPES.map((type) => (
                                  <CommandItem
                                    key={type}
                                    value={type}
                                    onSelect={(currentValue) => {
                                      setUsage(currentValue === usage ? "" : currentValue);
                                      setUsageOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        usage === type ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {type}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Peripherals Checkbox */}
                  <div className="flex items-center gap-3 mb-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <Checkbox
                      id="peripherals"
                      checked={includePeripherals}
                      onCheckedChange={(checked) => setIncludePeripherals(checked as boolean)}
                    />
                    <label
                      htmlFor="peripherals"
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      Include Peripherals (Monitor, Keyboard, Mouse, Headset) in budget
                      <p className="text-xs text-muted-foreground mt-1">
                        If unchecked, budget is for PC components only
                      </p>
                    </label>
                  </div>

                  {/* Budget Input */}
                  <div className="space-y-2 mb-8">
                    <Label htmlFor="budget" className="text-sm font-medium">Total Budget</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        {selectedCurrency.symbol}
                      </span>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="2000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="pl-12 bg-background/50 border-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateBuild}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-background font-semibold py-6 rounded-lg neon-glow transition-all duration-300"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate Build"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-primary/20 backdrop-blur-sm bg-background/30 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Powered by <span className="text-primary font-semibold">Base44 AI</span>
              </p>
              <p className="text-xs text-muted-foreground text-center md:text-right">
                Prices and availability subject to change. All recommendations are estimates based on current market data.
              </p>
              <a 
                href="/feedback" 
                className="text-sm text-primary hover:text-secondary transition-colors font-medium"
              >
                Share Feedback
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
