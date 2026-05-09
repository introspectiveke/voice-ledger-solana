
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

