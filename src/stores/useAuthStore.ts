import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  getIdToken,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { auth } from "../shared/firebase/firebase";

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  isSignedIn: boolean;

  hydrate: () => () => void;
  setIsSignedIn: (value: boolean) => void;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hydrated: false,
      isSignedIn: false,

      setIsSignedIn: (value: boolean) => {
        set({ isSignedIn: value });
      },

      hydrate: () => {
        const unsub = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const token = await getIdToken(user, true);
            set({ user, token, hydrated: true, isSignedIn: true });
          } else {
            set({ user: null, token: null, hydrated: true, isSignedIn: false });
          }
        });

        return unsub;
      },

      signIn: async (email, password) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const token = await getIdToken(cred.user, true);
        set({ user: cred.user, token, isSignedIn: true });
      },

      signUp: async (email, password) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const token = await getIdToken(cred.user, true);
        set({ user: cred.user, token, isSignedIn: true });
      },

      resetPassword: async (email) => {
        await sendPasswordResetEmail(auth, email);
      },

      signOut: async () => {
        await fbSignOut(auth);
        set({ user: null, token: null, isSignedIn: false });
      },

      refreshToken: async () => {
        const user = get().user;
        if (!user) return;
        const token = await getIdToken(user, true);
        set({ token });
      },
    }),
    {
      name: "innoma-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isSignedIn: state.isSignedIn,
      }),
    }
  )
);