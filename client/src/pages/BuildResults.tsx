import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Share2, Save, AlertCircle, ExternalLink } from "lucide-react";
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
              specs: "DDR5 6000MHz, CAS 30",
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
              name: "ASUS ProArt B650-CREATOR",
              specs: "AM5, PCIe 5.0, 10G Ethernet",
              price: 349,
              link: "#",
            },
            {
              category: "RAM",
              name: "Corsair Dominator Platinum 128GB",
              specs: "DDR5 5600MHz, CAS 28",
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
              name: "Fractal Design Torrent RGB",
              specs: "E-ATX, Excellent Airflow",
              price: 249,
              link: "#",
            },
            {
              category: "CPU Cooler",
              name: "Noctua NH-U14S TR4-SP3",
              specs: "Dual Tower, 140mm Fans",
              price: 89,
              link: "#",
            },
          ],
          totalPrice: 3682,
          estimatedPerformance: "Professional Workstation (Rendering, 3D, Video)",
          recommendation:
            "High-core-count CPU with professional GPU for content creation. Excellent for rendering, 3D modeling, and video editing.",
        },
        "Office & Productivity": {
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
              name: "ASUS Prime B760-PLUS",
              specs: "LGA1700, PCIe 4.0",
              price: 129,
              link: "#",
            },
            {
              category: "RAM",
              name: "Corsair Vengeance 16GB",
              specs: "DDR5 5600MHz, CAS 28",
              price: 69,
              link: "#",
            },
            {
              category: "Storage",
              name: "Samsung 870 QVO 1TB",
              specs: "2.5\" SSD, SATA III",
              price: 79,
              link: "#",
            },
            {
              category: "PSU",
              name: "Seasonic Core GM 650W",
              specs: "650W, 80+ Gold",
              price: 79,
              link: "#",
            },
            {
              category: "Case",
              name: "NZXT H510",
              specs: "ATX, Compact, Tempered Glass",
              price: 69,
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
        components: result.components.map(comp => ({
          ...comp,
          price: Math.round(comp.price * (params.currency === "USD ($)" ? 1 : 1.2)),
        })),
        totalPrice: Math.round(result.totalPrice * (params.currency === "USD ($)" ? 1 : 1.2)),
      };

      setBuildResult(adjustedResult);
      setIsLoading(false);
      toast.success("Build generated successfully!");
    }, 1500);
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

    const baseUrl = buildParams ? regionShoppingLinks[buildParams.region] || regionShoppingLinks["United States"] : regionShoppingLinks["United States"];
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
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              PCArchitect.ai
            </span>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 neon-text text-primary" style={{ fontFamily: "var(--font-display)" }}>
                  Your Custom PC Build
                </h1>
                <p className="text-lg text-muted-foreground">
                  Optimized for {buildParams.usage} in {buildParams.region}
                </p>
              </div>

              {/* Summary Card */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur-sm mb-8">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{buildResult.estimatedPerformance}</CardTitle>
                      <CardDescription className="mt-2">{buildResult.recommendation}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {currencySymbol}{buildResult.totalPrice.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Budget</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Button
                  onClick={handleSaveBuild}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Build
                </Button>
                <Button
                  onClick={handleShareBuild}
                  variant="outline"
                  className="border-primary/30 hover:border-primary/50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Build
                </Button>
              </div>

              {/* Components Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {buildResult.components.map((component, idx) => (
                  <Card key={idx} className="border-primary/20 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{component.category}</CardTitle>
                          <CardDescription className="mt-1">{component.name}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {currencySymbol}{component.price}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{component.specs}</p>
                      <a
                        href={getShoppingLink(component.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-primary/30 hover:border-primary/50"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Shop Now
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Region/Currency Note */}
              <Card className="border-primary/20 bg-primary/10 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    Shopping Links Optimized for Your Region
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>The shopping links above are optimized for <span className="font-semibold text-foreground">{buildParams.region}</span> and use <span className="font-semibold text-foreground">{buildParams.currency}</span>.</p>
                  <p>To get dedicated shopping pages for each component in your preferred region/currency, go back to the builder and change your region and currency settings.</p>
                </CardContent>
              </Card>

              {/* Info Box */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Prices are subject to change and vary by retailer and region</p>
                  <p>• Compatibility has been verified for all components</p>
                  <p>• Estimated performance is based on standard benchmarks</p>
                  <p>• Installation and assembly not included</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
