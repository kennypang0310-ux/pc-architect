export interface CompatibilityIssue {
  severity: "error" | "warning" | "info";
  category: string;
  message: string;
  components: string[];
  suggestion?: string;
}

export interface CompatibilityResult {
  isCompatible: boolean;
  issues: CompatibilityIssue[];
  warnings: CompatibilityIssue[];
  infos: CompatibilityIssue[];
  success: boolean;
  error?: string;
}

export interface BuildComponent {
  category: string;
  name: string;
  specs: string;
}

export function checkCompatibility(components: BuildComponent[]): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];
  const warnings: CompatibilityIssue[] = [];
  const infos: CompatibilityIssue[] = [];

  try {
    // Find components by category
    const cpu = components.find(c => c.category === "CPU");
    const gpu = components.find(c => c.category === "GPU");
    const motherboard = components.find(c => c.category === "Motherboard");
    const ram = components.find(c => c.category === "RAM");
    const psu = components.find(c => c.category === "PSU");
    const cooler = components.find(c => c.category === "CPU Cooler");
    const storage = components.find(c => c.category === "Storage");
    const pcCase = components.find(c => c.category === "Case");

    // 1. Check CPU Socket Compatibility
    if (cpu && motherboard) {
      const cpuSocket = extractSocket(cpu.specs);
      const mbSocket = extractSocket(motherboard.specs);
      
      if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        issues.push({
          severity: "error",
          category: "CPU Socket",
          message: `CPU socket mismatch: ${cpuSocket} CPU is not compatible with ${mbSocket} motherboard`,
          components: ["CPU", "Motherboard"],
          suggestion: `Choose a ${mbSocket} socket CPU or a motherboard with ${cpuSocket} socket`
        });
      } else if (cpuSocket && mbSocket) {
        infos.push({
          severity: "info",
          category: "CPU Socket",
          message: `CPU and motherboard sockets are compatible (${cpuSocket})`,
          components: ["CPU", "Motherboard"]
        });
      }
    }

    // 2. Check RAM Type Compatibility
    if (ram && motherboard) {
      const ramType = extractRAMType(ram.specs);
      const mbRamType = extractRAMType(motherboard.specs);
      
      if (ramType && mbRamType && ramType !== mbRamType) {
        issues.push({
          severity: "error",
          category: "RAM Type",
          message: `RAM type mismatch: ${ramType} RAM is not compatible with ${mbRamType} motherboard`,
          components: ["RAM", "Motherboard"],
          suggestion: `Use ${mbRamType} RAM or choose a ${ramType} compatible motherboard`
        });
      } else if (ramType && mbRamType) {
        infos.push({
          severity: "info",
          category: "RAM Type",
          message: `RAM and motherboard types are compatible (${ramType})`,
          components: ["RAM", "Motherboard"]
        });
      }
    }

    // 3. Check CPU Cooler Socket Compatibility
    if (cpu && cooler) {
      const cpuSocket = extractSocket(cpu.specs);
      const coolerSocket = extractSocket(cooler.specs);
      
      if (cpuSocket && coolerSocket && cpuSocket !== coolerSocket) {
        issues.push({
          severity: "error",
          category: "CPU Cooler Socket",
          message: `CPU cooler socket mismatch: Cooler supports ${coolerSocket} but CPU is ${cpuSocket}`,
          components: ["CPU Cooler", "CPU"],
          suggestion: `Choose a cooler compatible with ${cpuSocket} socket`
        });
      }
    }

    // 4. Check PSU Wattage
    if (cpu && gpu && psu) {
      const cpuPower = estimateCPUPower(cpu.specs);
      const gpuPower = estimateGPUPower(gpu.specs);
      const psuWattage = extractWattage(psu.specs);
      
      if (cpuPower && gpuPower && psuWattage) {
        const totalPower = cpuPower + gpuPower + 50; // Add 50W for other components
        const headroom = psuWattage - totalPower;
        
        if (headroom < 100) {
          warnings.push({
            severity: "warning",
            category: "PSU Wattage",
            message: `Low PSU headroom: ${headroom}W remaining (${totalPower}W used of ${psuWattage}W)`,
            components: ["PSU", "CPU", "GPU"],
            suggestion: `Consider upgrading to a higher wattage PSU for better stability`
          });
        } else {
          infos.push({
            severity: "info",
            category: "PSU Wattage",
            message: `PSU has adequate headroom: ${headroom}W remaining (${totalPower}W used of ${psuWattage}W)`,
            components: ["PSU"]
          });
        }
      }
    }

    // 5. Check Case Size Compatibility
    if (motherboard && pcCase) {
      const mbSize = extractMotherboardSize(motherboard.specs);
      const caseSize = extractCaseSize(pcCase.specs);
      
      if (mbSize && caseSize) {
        const compatible = isCaseCompatible(mbSize, caseSize);
        if (!compatible) {
          issues.push({
            severity: "error",
            category: "Case Compatibility",
            message: `${mbSize} motherboard is not compatible with ${caseSize} case`,
            components: ["Case", "Motherboard"],
            suggestion: `Choose a case that supports ${mbSize} motherboards`
          });
        } else {
          infos.push({
            severity: "info",
            category: "Case Compatibility",
            message: `${mbSize} motherboard is compatible with ${caseSize} case`,
            components: ["Case", "Motherboard"]
          });
        }
      }
    }

    // 6. Check Storage Interface
    if (storage && motherboard) {
      const storageType = extractStorageType(storage.specs);
      const mbSupport = extractMotherboardStorage(motherboard.specs);
      
      if (storageType && mbSupport && !mbSupport.includes(storageType)) {
        warnings.push({
          severity: "warning",
          category: "Storage Interface",
          message: `Storage interface may not be optimal: ${storageType} on ${mbSupport.join("/")} motherboard`,
          components: ["Storage", "Motherboard"]
        });
      }
    }
  } catch (error) {
    return {
      isCompatible: false,
      issues: [],
      warnings: [],
      infos: [],
      success: false,
      error: String(error)
    };
  }

  return {
    isCompatible: issues.length === 0,
    issues,
    warnings,
    infos,
    success: true
  };
}

// Helper functions
function extractSocket(specs: string): string | null {
  const patterns = [
    /Socket\s+([A-Z0-9]+)/i,
    /\b(AM5|AM4|LGA1700|LGA1200|TR4|sTRX4|SP3)\b/i
  ];
  
  for (const pattern of patterns) {
    const match = specs.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  return null;
}

function extractRAMType(specs: string): string | null {
  const ramMatch = specs.match(/(DDR[0-9]|LPDDR[0-9])/i);
  return ramMatch ? ramMatch[1].toUpperCase() : null;
}

function extractWattage(specs: string): number | null {
  const wattMatch = specs.match(/(\d+)W/i);
  return wattMatch ? parseInt(wattMatch[1]) : null;
}

function estimateCPUPower(specs: string): number {
  // Extract CPU model and estimate TDP
  if (specs.includes("Ryzen 9 7950X")) return 162;
  if (specs.includes("Ryzen 9")) return 140;
  if (specs.includes("Ryzen 7")) return 105;
  if (specs.includes("Ryzen 5")) return 65;
  if (specs.includes("Core i9")) return 150;
  if (specs.includes("Core i7")) return 125;
  if (specs.includes("Core i5")) return 65;
  return 95; // Default estimate
}

function estimateGPUPower(specs: string): number {
  // Extract GPU model and estimate TGP
  if (specs.includes("RTX 4090")) return 575;
  if (specs.includes("RTX 4080")) return 320;
  if (specs.includes("RTX 4070")) return 200;
  if (specs.includes("RTX 4060")) return 115;
  return 200; // Default estimate
}

function extractMotherboardSize(specs: string): string | null {
  if (specs.includes("E-ATX")) return "E-ATX";
  if (specs.includes("ATX")) return "ATX";
  if (specs.includes("Micro-ATX") || specs.includes("mATX")) return "Micro-ATX";
  if (specs.includes("Mini-ITX")) return "Mini-ITX";
  return null;
}

function extractCaseSize(specs: string): string | null {
  if (specs.includes("E-ATX")) return "E-ATX";
  if (specs.includes("ATX")) return "ATX";
  if (specs.includes("Micro-ATX") || specs.includes("mATX")) return "Micro-ATX";
  if (specs.includes("Mini-ITX")) return "Mini-ITX";
  return null;
}

function isCaseCompatible(mbSize: string, caseSize: string): boolean {
  const sizeHierarchy: Record<string, number> = {
    "Mini-ITX": 1,
    "Micro-ATX": 2,
    "ATX": 3,
    "E-ATX": 4
  };

  const mbLevel = sizeHierarchy[mbSize] || 0;
  const caseLevel = sizeHierarchy[caseSize] || 0;

  // Case must be able to fit the motherboard
  return caseLevel >= mbLevel;
}

function extractStorageType(specs: string): string | null {
  if (specs.includes("NVMe")) return "NVMe";
  if (specs.includes("SATA")) return "SATA";
  if (specs.includes("M.2")) return "M.2";
  return null;
}

function extractMotherboardStorage(specs: string): string[] {
  const supported: string[] = [];
  if (specs.includes("NVMe") || specs.includes("M.2")) supported.push("NVMe");
  if (specs.includes("SATA")) supported.push("SATA");
  return supported.length > 0 ? supported : ["SATA"]; // Default to SATA
}
