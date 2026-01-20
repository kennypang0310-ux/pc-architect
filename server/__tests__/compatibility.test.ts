import { describe, it, expect } from "vitest";
import { checkCompatibility } from "../services/compatibility";

describe("Compatibility Service", () => {
  describe("CPU Socket Compatibility", () => {
    it("should detect CPU socket mismatch", () => {
      const components = [
        { category: "CPU", name: "AMD Ryzen 5 7600X", specs: "6-Core, 4.7GHz, Socket AM5" },
        { category: "Motherboard", name: "MSI PRO B760M-A", specs: "LGA1700, PCIe 5.0" },
      ];

      const result = checkCompatibility(components);
      
      expect(result.isCompatible).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0]?.category).toBe("CPU Socket");
    });

    it("should pass compatible CPU and motherboard", () => {
      const components = [
        { category: "CPU", name: "AMD Ryzen 5 7600X", specs: "6-Core, 4.7GHz, Socket AM5" },
        { category: "Motherboard", name: "ASUS ROG STRIX B650-E", specs: "AM5, PCIe 5.0, WiFi 6E, DDR5" },
      ];

      const result = checkCompatibility(components);
      
      expect(result.isCompatible).toBe(true);
      expect(result.issues.length).toBe(0);
    });
  });

  describe("RAM Type Compatibility", () => {
    it("should detect RAM type mismatch", () => {
      const components = [
        { category: "RAM", name: "Corsair Vengeance RGB 32GB", specs: "DDR5 6000MHz, Cas 30" },
        { category: "Motherboard", name: "ASUS TUF B550-PLUS", specs: "AM4, DDR4, PCIe 4.0" },
      ];

      const result = checkCompatibility(components);
      
      expect(result.isCompatible).toBe(false);
      expect(result.issues.some(i => i.category === "RAM Type")).toBe(true);
    });

    it("should pass compatible RAM and motherboard", () => {
      const components = [
        { category: "RAM", name: "Corsair Vengeance RGB 32GB", specs: "DDR5 6000MHz, Cas 30" },
        { category: "Motherboard", name: "ASUS ROG STRIX B650-E", specs: "AM5, PCIe 5.0, WiFi 6E, DDR5" },
      ];

      const result = checkCompatibility(components);
      
      expect(result.issues.some(i => i.category === "RAM Type")).toBe(false);
    });
  });

  describe("PSU Wattage", () => {
    it("should warn about low PSU headroom", () => {
      const components = [
        { category: "CPU", name: "AMD Ryzen 9 7950X", specs: "16-Core, 5.7GHz, Socket AM5" },
        { category: "GPU", name: "NVIDIA RTX 4090", specs: "24GB GDDR6X, PCIe 4.0" },
        { category: "PSU", name: "Corsair RM750x", specs: "750W, 80+ Gold, Modular" },
      ];

      const result = checkCompatibility(components);
      
      expect(result.warnings.some(w => w.category === "PSU Wattage")).toBe(true);
    });
  });

  describe("Case Compatibility", () => {
    it("should detect incompatible case size", () => {
      const components = [
        { category: "Case", name: "Lian Li A4-H2O", specs: "Mini-ITX, Aluminum, Compact" },
        { category: "Motherboard", name: "ASUS ROG STRIX B650-E", specs: "ATX, PCIe 5.0, DDR5" },
      ];

      const result = checkCompatibility(components);
      
      expect(result.isCompatible).toBe(false);
      expect(result.issues.some(i => i.category === "Case Compatibility")).toBe(true);
    });
  });

  describe("Complete Build Compatibility", () => {
    it("should validate a fully compatible build", () => {
      const components = [
        { category: "CPU", name: "AMD Ryzen 5 7600X", specs: "6-Core, 4.7GHz, Socket AM5" },
        { category: "GPU", name: "NVIDIA RTX 4070", specs: "12GB GDDR6X, PCIe 4.0" },
        { category: "Motherboard", name: "ASUS ROG STRIX B650-E", specs: "AM5, PCIe 5.0, WiFi 6E, DDR5" },
        { category: "RAM", name: "Corsair Vengeance RGB 32GB", specs: "DDR5 6000MHz, Cas 30" },
        { category: "PSU", name: "Corsair RM850x", specs: "850W, 80+ Gold, Modular" },
        { category: "Case", name: "Lian Li Lancool 3", specs: "ATX, Tempered Glass, 3x Fans" },
      ];

      const result = checkCompatibility(components);
      
      expect(result.isCompatible).toBe(true);
      expect(result.issues.length).toBe(0);
    });
  });
});
