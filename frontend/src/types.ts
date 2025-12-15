export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  thumbnail?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  theme: "light" | "dark";
}
