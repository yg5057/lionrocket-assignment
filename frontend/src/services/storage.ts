import type { Character, Message, User } from "../types.ts";

const KEYS = {
  USER: "ai_chat_user",
  CHARACTERS: "ai_chat_characters",
  CHATS: "ai_chat_history_",
};

const DEFAULT_CHARACTERS: Character[] = [
  {
    id: "char_default_1",
    name: "친절한 AI",
    description: "무엇이든 친절하게 답변해주는 기본 AI입니다.",
    systemPrompt: "당신은 도움이 되고 친절한 AI 어시스턴트입니다.",
    isDefault: true,
  },
  {
    id: "char_default_2",
    name: "까칠한 고양이",
    description: "말끝마다 냥을 붙이는 귀여운 고양이입니다.",
    systemPrompt:
      '당신은 고양이입니다. 모든 문장의 끝을 "다냥" 또는 "냥"으로 끝내세요. 조금 도도하게 행동하세요.',
    isDefault: true,
  },
  {
    id: "char_default_3",
    name: "영어 선생님",
    description: "한국말을 영어로 번역해주고 교정해줍니다.",
    systemPrompt:
      "당신은 영어 교육 전문가입니다. 사용자가 입력한 한국어를 자연스러운 영어로 번역하고, 문법적 설명을 덧붙이세요.",
    isDefault: true,
  },
];

export const storage = {
  saveUser: (user: User) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  clearUser: () => {
    localStorage.removeItem(KEYS.USER);
  },

  getCharacters: (): Character[] => {
    const data = localStorage.getItem(KEYS.CHARACTERS);
    if (!data) {
      localStorage.setItem(KEYS.CHARACTERS, JSON.stringify(DEFAULT_CHARACTERS));
      return DEFAULT_CHARACTERS;
    }
    return JSON.parse(data);
  },

  addCharacter: (character: Character) => {
    const current = storage.getCharacters();
    const updated = [...current, character];
    localStorage.setItem(KEYS.CHARACTERS, JSON.stringify(updated));
  },

  deleteCharacter: (id: string) => {
    const current = storage.getCharacters();
    const updated = current.filter((char) => char.id !== id || char.isDefault);
    localStorage.setItem(KEYS.CHARACTERS, JSON.stringify(updated));
  },

  updateCharacter: (updatedChar: Character) => {
    const current = storage.getCharacters();
    const updated = current.map((char) =>
      char.id === updatedChar.id ? updatedChar : char
    );
    localStorage.setItem(KEYS.CHARACTERS, JSON.stringify(updated));
  },

  getMessages: (characterId: string): Message[] => {
    const key = `${KEYS.CHATS}${characterId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  addMessage: (characterId: string, message: Message) => {
    const key = `${KEYS.CHATS}${characterId}`;
    const currentMessages = storage.getMessages(characterId);
    const updatedMessages = [...currentMessages, message];
    localStorage.setItem(key, JSON.stringify(updatedMessages));
  },

  clearMessages: (characterId: string) => {
    const key = `${KEYS.CHATS}${characterId}`;
    localStorage.removeItem(key);
  },
};
