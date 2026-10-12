import "server-only"

import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: "http://localhost:11434/v1",
})

// Local model served by Ollama, shared by the chat and title generation.
export const model = ollama("qwen3:8b")
