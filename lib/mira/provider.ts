import type { MiraProvider } from "@/lib/mira/types";
import { DeepSeekMiraProvider } from "@/lib/mira/deepseekProvider";
import { MockMiraProvider } from "@/lib/mira/mockProvider";

export function createMiraProvider(): MiraProvider {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.MIRA_API_KEY;
  if (!apiKey) {
    return new MockMiraProvider();
  }

  return new DeepSeekMiraProvider(
    apiKey,
    process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
    process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash"
  );
}
