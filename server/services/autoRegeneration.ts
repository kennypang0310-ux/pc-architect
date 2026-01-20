import { checkCompatibility } from "./compatibility";

export interface BuildComponent {
  category: string;
  name: string;
  specs: string;
}

export interface RegenerationResult {
  components: BuildComponent[];
  regeneratedComponents: string[];
  issues: any[];
  warnings: any[];
  isFullyCompatible: boolean;
  regenerationAttempts: number;
  error?: string;
}

// Component database for regeneration
const componentDatabase: Record<string, BuildComponent[]> = {
  CPU: [
    { category: "CPU", name: "AMD Ryzen 5 7600X", specs: "6-Core, 4.7GHz, Socket AM5" },
    { category: "CPU", name: "AMD Ryzen 9 7950X", specs: "16-Core, 4.5GHz, Socket AM5" },
    { category: "CPU", name: "Intel Core i5-13600K", specs: "14-Core, 3.5GHz, Socket LGA1700" },
    { category: "CPU", name: "Intel Core i7-13700K", specs: "16-Core, 3.4GHz, Socket LGA1700" },
    { category: "CPU", name: "Intel Core i9-13900KS", specs: "24-Core, 6.0GHz, Socket LGA1700" },
  ],
  GPU: [
    { category: "GPU", name: "NVIDIA RTX 4070", specs: "12GB GDDR6X, PCIe 4.0" },
    { category: "GPU", name: "NVIDIA RTX 4080", specs: "16GB GDDR6X, PCIe 4.0" },
    { category: "GPU", name: "NVIDIA RTX 4090", specs: "24GB GDDR6X, PCIe 4.0" },
  ],
  Motherboard: [
    { category: "Motherboard", name: "ASUS ROG STRIX B650-E", specs: "AM5, PCIe 5.0, WiFi 6E, DDR5" },
    { category: "Motherboard", name: "ASUS TUF B550-PLUS", specs: "AM4, DDR4, PCIe 4.0" },
    { category: "Motherboard", name: "MSI PRO B760M-A", specs: "LGA1700, DDR4, PCIe 5.0" },
    { category: "Motherboard", name: "ASUS ROG MAXIMUS Z790", specs: "LGA1700, PCIe 5.0, WiFi 7, DDR5" },
  ],
  RAM: [
    { category: "RAM", name: "Corsair Vengeance RGB 32GB", specs: "DDR5 6000MHz, Cas 30" },
    { category: "RAM", name: "Kingston Fury Beast 16GB", specs: "DDR4 3200MHz, Cas 16" },
    { category: "RAM", name: "G.Skill Trident Z5 64GB", specs: "DDR5 6000MHz, CAS 28" },
  ],
  PSU: [
    { category: "PSU", name: "Corsair RM750x", specs: "750W, 80+ Gold, Modular" },
    { category: "PSU", name: "Corsair RM850x", specs: "850W, 80+ Gold, Modular" },
    { category: "PSU", name: "Corsair HX1200i", specs: "1200W, 80+ Platinum, Modular" },
    { category: "PSU", name: "Corsair HX1500i", specs: "1500W, 80+ Platinum, Modular" },
  ],
  Case: [
    { category: "Case", name: "Lian Li Lancool 3", specs: "ATX, Tempered Glass, 3x Fans" },
    { category: "Case", name: "Lian Li A4-H2O", specs: "Mini-ITX, Aluminum, Compact" },
    { category: "Case", name: "Corsair 5000T RGB", specs: "E-ATX, Tempered Glass, 6x Fans" },
  ],
  "CPU Cooler": [
    { category: "CPU Cooler", name: "Noctua NH-D15", specs: "Dual Tower, 140mm Fans, Socket AM5" },
    { category: "CPU Cooler", name: "NZXT Kraken X73", specs: "360mm AIO, RGB" },
  ],
  Storage: [
    { category: "Storage", name: "Samsung 990 Pro 1TB", specs: "NVMe M.2, PCIe 4.0, 7100MB/s" },
    { category: "Storage", name: "WD Blue 500GB", specs: "SSD, SATA, 550MB/s" },
  ],
};

export function autoRegenerateComponents(components: BuildComponent[]): RegenerationResult {
  let currentComponents = [...components];
  const regeneratedComponents: string[] = [];
  let regenerationAttempts = 0;
  const maxAttempts = 5;

  while (regenerationAttempts < maxAttempts) {
    const compatibilityResult = checkCompatibility(currentComponents);

    if (compatibilityResult.isCompatible) {
      return {
        components: currentComponents,
        regeneratedComponents,
        issues: compatibilityResult.issues,
        warnings: compatibilityResult.warnings,
        isFullyCompatible: true,
        regenerationAttempts,
      };
    }

    // Find components to regenerate based on issues
    const componentsToRegenerate = new Set<string>();
    
    for (const issue of compatibilityResult.issues) {
      if (issue.components && Array.isArray(issue.components)) {
        for (const comp of issue.components) {
          componentsToRegenerate.add(comp);
        }
      }
    }

    if (componentsToRegenerate.size === 0) {
      // No components to regenerate but still incompatible
      break;
    }

    // Regenerate components
    for (const category of Array.from(componentsToRegenerate)) {
      const componentIndex = currentComponents.findIndex(c => c.category === category);
      if (componentIndex !== -1 && componentDatabase[category]) {
        // Pick a compatible component from the database
        const alternatives = componentDatabase[category];
        const newComponent = alternatives[Math.floor(Math.random() * alternatives.length)];
        currentComponents[componentIndex] = newComponent;
        
        if (!regeneratedComponents.includes(category)) {
          regeneratedComponents.push(category);
        }
      }
    }

    regenerationAttempts++;
  }

  // If we've exhausted attempts, return what we have
  const finalCompatibilityResult = checkCompatibility(currentComponents);
  return {
    components: currentComponents,
    regeneratedComponents,
    issues: finalCompatibilityResult.issues,
    warnings: finalCompatibilityResult.warnings,
    isFullyCompatible: finalCompatibilityResult.isCompatible,
    regenerationAttempts,
  };
}
