import { create } from "zustand";
import { persist } from "zustand/middleware";

type likedReposStore = {
  likedReposIds: number[];
  addLikedRepo: (id: number) => void;
  removeLikedRepo: (id: number) => void;
};

export const useLikedReposStore = create(
  persist<likedReposStore>(
    (set) => ({
      likedReposIds: [],
      addLikedRepo: (id: number) =>
        set((state) => ({ likedReposIds: [...state.likedReposIds, id] })),
      removeLikedRepo: (id: number) =>
        set((state) => ({
          likedReposIds: state.likedReposIds.filter((repoId) => repoId !== id),
        })),
    }),
    {
      name: "likedRepos",
    }
  )
);
