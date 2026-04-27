import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeComplaint } from "./complaint-ai";

const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn()
}));

vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      })
    }))
  };
});

describe("analyzeComplaint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return analyzed data in correct format", async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify({
          sentiment: "NEGATIVE",
          priority: "HIGH",
          summary: "Billing issue detected.",
          category: "Billing"
        })
      }
    });

    const result = await analyzeComplaint("Billing Error", "I was charged twice.");
    
    expect(result).toHaveProperty("sentiment");
    expect(result.sentiment).toBe("NEGATIVE");
  });

  it("should handle AI failure gracefully", async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error("AI error"));

    const result = await analyzeComplaint("Title", "Description");
    
    expect(result.sentiment).toBe("NEUTRAL");
    expect(result.summary).toContain("Manual review required");
  });
});
