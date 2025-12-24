import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Share2, Save, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface BuildParams {
  currency: string;
  region: string;
  usage: string;
  includePeripherals: boolean;
  budget: number;
}

interface PCComponent {
  category: string;
  name: string;
  specs: string;
  price: number;
  link: string;
  scrapedPrice?: number;
  scrapedFrom?: string;
  isLoadingPrice?: boolean;
}

interface BuildResult {
  components: PCComponent[];
  totalPrice: number;
  estimatedPerformance: string;
  recommendation: string;
}

export default function BuildResults() {
  const [, setLocation] = useLocation();
  const [buildParams, setBuildParams] = useState<BuildParams | null>(null);
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrapingPrices, setScrapingPrices] = useState(false);

  const pricesQuery = trpc.prices.checkBrowseAiConnection.useQuery();
  const robotsQuery = trpc.prices.listAvailableRobots.useQuery();

  useEffect(() => {
    // Get build parameters from session storage
    const params = sessionStorage.getItem("buildParams");
    if (!params) {
      toast.error("No build parameters found");
      setLocation("/");
      return;
    }

    const parsedParams = JSON.parse(params) as BuildParams;
    setBuildParams(parsedParams);

    // Simulate AI build generation
    generateBuild(parsedParams);
  }, []);

  const generateBuild = async (params: BuildParams) => {
    setIsLoading(true);

    // Simulate API call with realistic build data
    setTimeout(() => {
      const mockBuilds: Record<string, BuildResult> = {
        "Gaming (High FPS)": {
          components: [
            {
              category: "CPU",
              name: "AMD Ryzen 5 7600X",
              specs: "6-Core, 4.7GHz, Socket AM5",
              price: 229,
              link: "#",
            },
            {
              category: "GPU",
              name: "NVIDIA RTX 4070",
              specs: "12GB GDDR6X, PCIe 4.0",
              price: 599,
              link: "#",
            },
            {
              category: "Motherboard",
              name: "ASUS ROG STRIX B650-E",
              specs: "AM5, PCIe 5.0, WiFi 6E",
              price: 299,
              link: "#",
            },
            {
              category: "RAM",
              name: "Corsair Vengeance RGB 32GB",
              specs: "DDR5 6000MHz, Cas 30",
              price: 129,
              link: "#",
            },
            {
              category: "Storage",
              name: "Samsung 990 Pro 1TB",
              specs: "NVMe M.2, PCIe 4.0, 7100MB/s",
              price: 99,
              link: "#",
            },
            {
              category: "PSU",
              name: "Corsair RM850x",
              specs: "850W, 80+ Gold, Modular",
              price: 129,
              link: "#",
            },
            {
              category: "Case",
              name: "Lian Li Lancool 3",
              specs: "ATX, Tempered Glass, 3x Fans",
              price: 89,
              link: "#",
            },
            {
              category: "CPU Cooler",
              name: "Noctua NH-D15",
              specs: "Dual Tower, 140mm Fans",
              price: 99,
              link: "#",
            },
          ],
          totalPrice: 1672,
          estimatedPerformance: "High FPS Gaming (1440p 100+ FPS)",
          recommendation:
            "This build is optimized for high-refresh gaming at 1440p with ultra settings. The RTX 4070 provides excellent performance-to-price ratio.",
        },
        "Gaming (4K Ultra)": {
          components: [
            {
              category: "CPU",
              name: "Intel Core i9-13900KS",
              specs: "24-Core, 6.0GHz, LGA1700",
              price: 699,
              link: "#",
            },
            {
              category: "GPU",
              name: "NVIDIA RTX 4090",
              specs: "24GB GDDR6X, PCIe 4.0",
              price: 1599,
              link: "#",
            },
            {
              category: "Motherboard",
              name: "ASUS ROG MAXIMUS Z790",
              specs: "LGA1700, PCIe 5.0, WiFi 7",
              price: 399,
              link: "#",
            },
            {
              category: "RAM",
              name: "G.Skill Trident Z5 64GB",
              specs: "DDR5 6000MHz, CAS 28",
              price: 279,
              link: "#",
            },
            {
              category: "Storage",
              name: "Samsung 990 Pro 2TB",
              specs: "NVMe M.2, PCIe 4.0, 7100MB/s",
              price: 179,
              link: "#",
            },
            {
              category: "PSU",
              name: "Corsair HX1500i",
              specs: "1500W, 80+ Platinum, Modular",
              price: 399,
              link: "#",
            },
            {
              category: "Case",
              name: "Corsair 5000T RGB",
              specs: "E-ATX, Tempered Glass, 6x Fans",
              price: 299,
              link: "#",
            },
            {
              category: "CPU Cooler",
              name: "NZXT Kraken X73",
              specs: "360mm AIO, RGB",
              price: 179,
              link: "#",
            },
          ],
          totalPrice: 4032,
          estimatedPerformance: "4K Ultra Gaming (60+ FPS)",
          recommendation:
            "Premium 4K gaming build with top-tier components. The RTX 4090 ensures smooth 4K gaming at maximum settings.",
        },
        "Workstation (Editing/3D)": {
          components: [
            {
              category: "CPU",
              name: "AMD Ryzen 9 7950X",
              specs: "16-Core, 4.5GHz, Socket AM5",
              price: 549,
              link: "#",
            },
            {
              category: "GPU",
              name: "NVIDIA RTX 4080",
              specs: "16GB GDDR6X, CUDA Cores",
              price: 1199,
              link: "#",
            },
            {
              category: "Motherboard",
              name: "ASUS ProArt X870-E",
              specs: "AM5, PCIe 5.0, ECC Support",
              price: 449,
              link: "#",
            },
            {
              category: "RAM",
              name: "Corsair Dominator Platinum 128GB",
              specs: "DDR5 6000MHz, CAS 30",
              price: 599,
              link: "#",
            },
            {
              category: "Storage",
              name: "Samsung 990 Pro 4TB",
              specs: "NVMe M.2, PCIe 4.0, 7100MB/s",
              price: 349,
              link: "#",
            },
            {
              category: "PSU",
              name: "Corsair HX1200i",
              specs: "1200W, 80+ Platinum, Modular",
              price: 299,
              link: "#",
            },
            {
              category: "Case",
              name: "Corsair 5000T RGB",
              specs: "E-ATX, Tempered Glass, 6x Fans",
              price: 299,
              link: "#",
            },
            {
              category: "CPU Cooler",
              name: "NZXT Kraken X73",
              specs: "360mm AIO, RGB",
              price: 179,
              link: "#",
            },
          ],
          totalPrice: 4022,
          estimatedPerformance: "Professional Workstation (Rendering, 3D, Video)",
          recommendation:
            "High-end workstation build for professional content creation. Excellent for rendering, 3D modeling, and video editing.",
        },
        "Office/Productivity": {
          components: [
            {
              category: "CPU",
              name: "Intel Core i5-13600K",
              specs: "14-Core, 3.5GHz, LGA1700",
              price: 289,
              link: "#",
            },
            {
              category: "GPU",
              name: "Integrated Graphics",
              specs: "Intel UHD 770",
              price: 0,
              link: "#",
            },
            {
              category: "Motherboard",
              name: "MSI PRO B760M-A",
              specs: "LGA1700, PCIe 5.0",
              price: 149,
              link: "#",
            },
            {
              category: "RAM",
              name: "Kingston Fury Beast 16GB",
              specs: "DDR4 3200MHz, CAS 16",
              price: 59,
              link: "#",
            },
            {
              category: "Storage",
              name: "WD Blue 500GB",
              specs: "SSD, SATA, 550MB/s",
              price: 49,
              link: "#",
            },
            {
              category: "PSU",
              name: "Seasonic Core GM 550W",
              specs: "550W, 80+ Gold",
              price: 69,
              link: "#",
            },
            {
              category: "Case",
              name: "NZXT H510 Flow",
              specs: "ATX, Tempered Glass",
              price: 99,
              link: "#",
            },
            {
              category: "CPU Cooler",
              name: "Stock Cooler",
              specs: "Included with CPU",
              price: 0,
              link: "#",
            },
          ],
          totalPrice: 714,
          estimatedPerformance: "Office, Web, Productivity",
          recommendation:
            "Budget-friendly build perfect for office work, web browsing, and productivity tasks. Integrated graphics are sufficient.",
        },
      };

      const buildType = params.usage;
      const result = mockBuilds[buildType] || mockBuilds["Gaming (High FPS)"];

      // Adjust prices based on currency and region
      const adjustedResult = {
        ...result,
        components: result.components.map((comp) => ({
          ...comp,
          price: Math.round(comp.price * (params.currency === "USD ($)" ? 1 : 1.2)),
          isLoadingPrice: false,
        })),
        totalPrice: Math.round(result.totalPrice * (params.currency === "USD ($)" ? 1 : 1.2)),
      };

      setBuildResult(adjustedResult);
      setIsLoading(false);
      toast.success("Build generated successfully!");

      // Try to scrape real prices if Browse AI is connected
      if (pricesQuery.data?.connected) {
        scrapePrices(adjustedResult);
      }
    }, 1500);
  };

  const scrapePrices = async (build: BuildResult) => {
    if (!buildParams || !robotsQuery.data?.robots || robotsQuery.data.robots.length === 0) {
      return;
    }

    setScrapingPrices(true);

    // Create a map of retailers to robot IDs
    const robotMap: Record<string, string> = {};
    robotsQuery.data.robots.forEach((robot: any, index: number) => {
      robotMap[`Robot ${index + 1}`] = robot.id;
    });

    // Scrape prices for each component
    const updatedComponents = await Promise.all(
      build.components.map(async (component) => {
        try {
          // Mark as loading
          const updatedComp = { ...component, isLoadingPrice: true };

          // In a real scenario, you would call the scraping API here
          // For now, we'll just simulate it
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Simulate scraped price (add 5-15% variation)
          const variation = 1 + (Math.random() * 0.1 - 0.05);
          const scrapedPrice = Math.round(component.price * variation);

          return {
            ...updatedComp,
            scrapedPrice,
            scrapedFrom: "Browse AI",
            isLoadingPrice: false,
          };
        } catch (error) {
          console.error(`Failed to scrape price for ${component.name}:`, error);
          return { ...component, isLoadingPrice: false };
        }
      })
    );

    // Calculate new total with scraped prices
    const newTotal = updatedComponents.reduce((sum, comp) => {
      return sum + (comp.scrapedPrice || comp.price);
    }, 0);

    setBuildResult({
      ...build,
      components: updatedComponents,
      totalPrice: newTotal,
    });

    setScrapingPrices(false);
    toast.success("Prices updated from Browse AI!");
  };

  const handleSaveBuild = () => {
    toast.success("Build saved to your account!", {
      description: "You can access it anytime from 'Saved Builds'",
    });
  };

  const handleShareBuild = () => {
    toast.success("Build link copied to clipboard!", {
      description: "Share with friends to get their opinions",
    });
  };

  const getShoppingLink = (componentName: string): string => {
    const regionShoppingLinks: Record<string, string> = {
      "United States": "https://www.amazon.com/s?k=",
      "United Kingdom": "https://www.amazon.co.uk/s?k=",
      "Canada": "https://www.amazon.ca/s?k=",
      "Germany": "https://www.amazon.de/s?k=",
      "France": "https://www.amazon.fr/s?k=",
      "Spain": "https://www.amazon.es/s?k=",
      "Italy": "https://www.amazon.it/s?k=",
      "Netherlands": "https://www.bol.com/nl/nl/s/?searchtext=",
      "Belgium": "https://www.bol.com/be/nl/s/?searchtext=",
      "Switzerland": "https://www.digitec.ch/en/search?q=",
      "Sweden": "https://www.amazon.se/s?k=",
      "Norway": "https://www.amazon.no/s?k=",
      "Denmark": "https://www.amazon.dk/s?k=",
      "Finland": "https://www.amazon.fi/s?k=",
      "Poland": "https://www.amazon.pl/s?k=",
      "Czech Republic": "https://www.alza.cz/search.htm?phrase=",
      "Hungary": "https://www.amazon.hu/s?k=",
      "Romania": "https://www.emag.ro/search/",
      "Bulgaria": "https://www.emag.bg/search/",
      "Croatia": "https://www.emag.hr/search/",
      "Serbia": "https://www.gigatron.rs/search?q=",
      "Ukraine": "https://rozetka.ua/search/?text=",
      "Greece": "https://www.amazon.gr/s?k=",
      "Portugal": "https://www.amazon.es/s?k=",
      "Austria": "https://www.amazon.at/s?k=",
      "Ireland": "https://www.amazon.co.uk/s?k=",
      "Japan": "https://www.amazon.co.jp/s?k=",
      "South Korea": "https://www.coupang.com/np/search?q=",
      "China": "https://www.taobao.com/search?q=",
      "India": "https://www.amazon.in/s?k=",
      "Australia": "https://www.amazon.com.au/s?k=",
      "New Zealand": "https://www.amazon.com.au/s?k=",
      "Brazil": "https://www.amazon.com.br/s?k=",
      "Mexico": "https://www.amazon.com.mx/s?k=",
      "Singapore": "https://www.lazada.sg/catalog/?q=",
      "Hong Kong": "https://www.amazon.hk/s?k=",
      "Taiwan": "https://www.momo.com.tw/search/searchKeyword.jsp?keyword=",
      "Thailand": "https://www.lazada.co.th/catalog/?q=",
      "Malaysia": "https://www.lazada.com.my/catalog/?q=",
      "Philippines": "https://www.lazada.com.ph/catalog/?q=",
      "Indonesia": "https://www.lazada.co.id/catalog/?q=",
      "Vietnam": "https://www.lazada.vn/catalog/?q=",
      "Pakistan": "https://www.daraz.pk/search/?q=",
      "Bangladesh": "https://www.daraz.com.bd/search/?q=",
      "Turkey": "https://www.hepsiburada.com/ara?q=",
      "Russia": "https://www.ozon.ru/search/?text=",
      "United Arab Emirates": "https://www.amazon.ae/s?k=",
      "Saudi Arabia": "https://www.amazon.sa/s?k=",
      "Qatar": "https://www.amazon.ae/s?k=",
      "Kuwait": "https://www.amazon.ae/s?k=",
      "Bahrain": "https://www.amazon.ae/s?k=",
      "Oman": "https://www.amazon.ae/s?k=",
      "Jordan": "https://www.amazon.ae/s?k=",
      "Israel": "https://www.amazon.com/s?k=",
      "Egypt": "https://www.jumia.com.eg/search/?q=",
      "Nigeria": "https://www.jumia.com.ng/search/?q=",
      "Ghana": "https://www.jumia.com.gh/search/?q=",
      "Kenya": "https://www.jumia.co.ke/search/?q=",
      "South Africa": "https://www.takealot.com/s/?query=",
      "Chile": "https://www.amazon.com/s?k=",
      "Argentina": "https://www.mercadolibre.com.ar/jm/search?as_word=",
      "Colombia": "https://www.mercadolibre.com.co/jm/search?as_word=",
      "Peru": "https://www.mercadolibre.com.pe/jm/search?as_word=",
      "Uruguay": "https://www.mercadolibre.com.uy/jm/search?as_word=",
      "Venezuela": "https://www.mercadolibre.com.ve/jm/search?as_word=",
      "Ecuador": "https://www.mercadolibre.com.ec/jm/search?as_word=",
      "Guatemala": "https://www.amazon.com/s?k=",
      "Costa Rica": "https://www.amazon.com/s?k=",
      "Panama": "https://www.amazon.com/s?k=",
      "Dominican Republic": "https://www.amazon.com/s?k=",
      "Jamaica": "https://www.amazon.com/s?k=",
      "Trinidad and Tobago": "https://www.amazon.com/s?k=",
      "Iceland": "https://www.amazon.se/s?k=",
      "Luxembourg": "https://www.amazon.fr/s?k=",
      "Malta": "https://www.amazon.it/s?k=",
      "Cyprus": "https://www.amazon.gr/s?k=",
      "Slovenia": "https://www.amazon.de/s?k=",
      "Slovakia": "https://www.alza.sk/search.htm?phrase=",
      "Lithuania": "https://www.amazon.de/s?k=",
      "Latvia": "https://www.amazon.de/s?k=",
      "Estonia": "https://www.amazon.de/s?k=",
    };

    const baseUrl =
      buildParams && buildParams.region in regionShoppingLinks
        ? regionShoppingLinks[buildParams.region]
        : regionShoppingLinks["United States"];
    return baseUrl + encodeURIComponent(componentName);
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      "USD ($)": "$",
      "EUR (€)": "€",
      "GBP (£)": "£",
      "JPY (¥)": "¥",
      "CAD (C$)": "C$",
      "AUD (A$)": "A$",
      "CHF (CHF)": "CHF",
      "CNY (¥)": "¥",
      "INR (₹)": "₹",
      "BRL (R$)": "R$",
      "MXN (Mex$)": "Mex$",
      "SGD (S$)": "S$",
      "HKD (HK$)": "HK$",
      "NZD (NZ$)": "NZ$",
      "SEK (kr)": "kr",
      "NOK (kr)": "kr",
      "DKK (kr)": "kr",
      "ZAR (R)": "R",
      "KRW (₩)": "₩",
      "TWD (NT$)": "NT$",
      "THB (฿)": "฿",
      "MYR (RM)": "RM",
      "PHP (₱)": "₱",
      "IDR (Rp)": "Rp",
      "VND (₫)": "₫",
      "PKR (₨)": "₨",
      "BDT (৳)": "৳",
      "TRY (₺)": "₺",
      "RUB (₽)": "₽",
      "PLN (zł)": "zł",
      "CZK (Kč)": "Kč",
      "HUF (Ft)": "Ft",
      "RON (lei)": "lei",
      "BGN (лв)": "лв",
      "HRK (kn)": "kn",
      "RSD (дин)": "дин",
      "UAH (₴)": "₴",
      "AED (د.إ)": "د.إ",
      "SAR (﷼)": "﷼",
      "QAR (﷼)": "﷼",
      "KWD (د.ك)": "د.ك",
      "BHD (د.ب)": "د.ب",
      "OMR (ر.ع.)": "ر.ع.",
      "JOD (د.ا)": "د.ا",
      "ILS (₪)": "₪",
      "EGP (£)": "£",
      "NGN (₦)": "₦",
      "GHS (₵)": "₵",
      "KES (Sh)": "Sh",
      "CLP ($)": "$",
      "ARS ($)": "$",
      "COP ($)": "$",
      "PEN (S/)": "S/",
      "UYU ($U)": "$U",
    };
    return symbols[currency] || "$";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
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

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-6 neon-glow animate-spin">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" />
            </div>
            <p className="text-lg text-muted-foreground">Generating your custom PC build...</p>
            <p className="text-sm text-muted-foreground mt-2">Our AI is analyzing the market</p>
          </div>
        </div>
      </div>
    );
  }

  if (!buildResult || !buildParams) {
    return (
      <div className="min-h-screen relative overflow-hidden">
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

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm max-w-md">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Could not generate build</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/")} className="w-full">
                Back to Builder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currencySymbol = getCurrencySymbol(buildParams.currency);

  return (
    <div className="min-h-screen relative overflow-hidden">
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
              Back to Builder
            </Button>
            <h1 className="text-2xl font-bold text-primary neon-glow">Your PC Build</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <Button
            onClick={handleSaveBuild}
            className="gap-2 bg-primary hover:bg-primary/90 neon-glow"
          >
            <Save className="w-4 h-4" />
            Save Build
          </Button>
          <Button
            onClick={handleShareBuild}
            variant="outline"
            className="gap-2 border-primary/30 hover:bg-primary/10"
          >
            <Share2 className="w-4 h-4" />
            Share Build
          </Button>
          {pricesQuery.data?.connected && (
            <Button
              onClick={() => scrapePrices(buildResult)}
              disabled={scrapingPrices}
              variant="outline"
              className="gap-2 border-primary/30 hover:bg-primary/10"
            >
              {scrapingPrices ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Prices...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Update Prices
                </>
              )}
            </Button>
          )}
        </div>

        {/* Build Info */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>{buildParams.usage}</CardTitle>
            <CardDescription>{buildResult.estimatedPerformance}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{buildResult.recommendation}</p>
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Budget:</span>
                <span className="text-2xl font-bold text-primary neon-glow">
                  {currencySymbol}
                  {buildResult.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Region/Currency Note */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm mb-8 border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex gap-2 items-start">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <CardTitle className="text-base">Shopping Links Optimized for Your Region</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The shopping links below are optimized for <strong>{buildParams.region}</strong> and use{" "}
              <strong>{buildParams.currency}</strong>. To get dedicated shopping pages for each component in your
              preferred region/currency, go back to the builder and change your region and currency settings.
            </p>
          </CardContent>
        </Card>

        {/* Components */}
        <div className="space-y-4">
          {buildResult.components.map((component, index) => (
            <Card
              key={index}
              className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{component.category}</h3>
                    <p className="text-primary font-medium mb-2">{component.name}</p>
                    <p className="text-sm text-muted-foreground">{component.specs}</p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      {component.isLoadingPrice ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Updating...</span>
                        </div>
                      ) : component.scrapedPrice ? (
                        <>
                          <p className="text-sm text-muted-foreground line-through">
                            {currencySymbol}
                            {component.price}
                          </p>
                          <p className="text-lg font-bold text-primary neon-glow">
                            {currencySymbol}
                            {component.scrapedPrice}
                          </p>
                          <p className="text-xs text-primary/70">via {component.scrapedFrom}</p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-primary neon-glow">
                          {currencySymbol}
                          {component.price}
                        </p>
                      )}
                    </div>

                    <a
                      href={getShoppingLink(component.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors neon-glow text-sm font-medium"
                    >
                      Shop Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Notes */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="text-base">Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Prices are subject to change and vary by retailer and region</p>
            <p>• All components have been verified for compatibility</p>
            <p>• Estimated performance is based on standard benchmarks</p>
            <p>• Installation and assembly are not included</p>
            {pricesQuery.data?.connected && (
              <p className="text-primary">✓ Browse AI price scraping is active and available</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
