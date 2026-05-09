import { describe, it, expect } from "vitest";

/**
 * Transaction parser utility for extracting amount and category from transcripts
 */
// Map word numbers to digits
const WORD_NUMBERS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

export function parseTranscript(text: string) {
  const lowerText = text.toLowerCase();

  // Extract amount (look for numbers or word numbers followed by "thousand", "hundred", etc.)
  let amount = null;
  
  // Try to match digit-based amounts first
  let amountMatch = text.match(/(\d+)\s*(thousand|hundred|k)?/i);
  
  // If no digit match, try word-based numbers
  if (!amountMatch) {
    const wordNumberPattern = Object.keys(WORD_NUMBERS).join("|");
    amountMatch = text.match(new RegExp(`(${wordNumberPattern})\\s*(thousand|hundred|k)?`, "i"));
  }
  
  if (amountMatch) {
    // Check if it's a word number or digit
    const numberPart = amountMatch[1].toLowerCase();
    amount = WORD_NUMBERS[numberPart] ?? parseInt(numberPart);
    
    if (amountMatch[2]?.toLowerCase() === "thousand" || amountMatch[2]?.toLowerCase() === "k") {
      amount *= 1000;
    } else if (amountMatch[2]?.toLowerCase() === "hundred") {
      amount *= 100;
    }
  }

  // Extract description
  let description = text;
  if (amountMatch) {
    description = text.replace(amountMatch[0], "").trim();
  }

  // Detect category
  let category = "Other";
  if (lowerText.includes("payment") || lowerText.includes("received")) {
    category = "Sales";
  } else if (
    lowerText.includes("expense") ||
    lowerText.includes("buy") ||
    lowerText.includes("purchase")
  ) {
    category = "Expenses";
  } else if (lowerText.includes("return")) {
    category = "Returns";
  }

  return {
    amount,
    description,
    category,
  };
}

// Re-export for testing
export { WORD_NUMBERS };

describe("Transaction Parser", () => {
  describe("Amount Extraction", () => {
    it("should extract simple amounts", () => {
      const result = parseTranscript("Received payment of five thousand");
      expect(result.amount).toBe(5000);
    });

    it("should extract amounts with 'k' suffix", () => {
      const result = parseTranscript("Paid 3k for supplies");
      expect(result.amount).toBe(3000);
    });

    it("should extract amounts with 'thousand' suffix", () => {
      const result = parseTranscript("Expense of 2 thousand");
      expect(result.amount).toBe(2000);
    });

    it("should extract amounts with 'hundred' suffix", () => {
      const result = parseTranscript("Purchase of 5 hundred");
      expect(result.amount).toBe(500);
    });

    it("should extract plain numbers", () => {
      const result = parseTranscript("Transaction of 1500");
      expect(result.amount).toBe(1500);
    });

    it("should return null if no amount found", () => {
      const result = parseTranscript("No amount here");
      expect(result.amount).toBeNull();
    });
  });

  describe("Description Extraction", () => {
    it("should extract description after amount", () => {
      const result = parseTranscript("5000 for inventory purchase");
      expect(result.description).toContain("for inventory purchase");
    });

    it("should handle descriptions with no amount", () => {
      const result = parseTranscript("Customer payment received");
      expect(result.description).toBe("Customer payment received");
    });

    it("should trim whitespace from description", () => {
      const result = parseTranscript("1000   customer payment");
      expect(result.description.trim()).toBe("customer payment");
    });
  });

  describe("Category Detection", () => {
    it("should detect Sales category from 'payment'", () => {
      const result = parseTranscript("Received payment of 5000");
      expect(result.category).toBe("Sales");
    });

    it("should detect Sales category from 'received'", () => {
      const result = parseTranscript("5000 received from customer");
      expect(result.category).toBe("Sales");
    });

    it("should detect Expenses category from 'expense'", () => {
      const result = parseTranscript("5000 expense for supplies");
      expect(result.category).toBe("Expenses");
    });

    it("should detect Expenses category from 'buy'", () => {
      const result = parseTranscript("Buy 2000 worth of stock");
      expect(result.category).toBe("Expenses");
    });

    it("should detect Expenses category from 'purchase'", () => {
      const result = parseTranscript("3000 purchase of equipment");
      expect(result.category).toBe("Expenses");
    });

    it("should detect Returns category", () => {
      const result = parseTranscript("1500 return from customer");
      expect(result.category).toBe("Returns");
    });

    it("should default to Other category", () => {
      const result = parseTranscript("5000 miscellaneous");
      expect(result.category).toBe("Other");
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle full transaction description", () => {
      const result = parseTranscript("Received payment of 5000 from John Smith for inventory");
      expect(result.amount).toBe(5000);
      expect(result.category).toBe("Sales");
      expect(result.description).toContain("from John Smith for inventory");
    });

    it("should handle case-insensitive category detection", () => {
      const result = parseTranscript("RECEIVED PAYMENT OF 3000");
      expect(result.category).toBe("Sales");
    });

    it("should handle multiple numbers (extract first)", () => {
      const result = parseTranscript("5000 for 2 items");
      expect(result.amount).toBe(5000);
    });
  });
});
