import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      userDetails: null,
      selectedChat: {
        id: '',
        isGroupChat: false,
        uid: '',
        uids: [],
        name: '',
        adminId: '',
      },
      replyMessage: null,
      chatMembers: [],
      setSelectedChat: (data) => set({ selectedChat: data }),
      setReplyMessage: (data) => set({ replyMessage: data }),
      setUserDetails: (data) => set({ userDetails: data }),
      setChatMembers: (data) =>
        set({
          chatMembers: { ...get().chatMembers, [data.chatId]: data.members },
        }),
    }),
    {
      name: 'storage',
    }
  )
);
