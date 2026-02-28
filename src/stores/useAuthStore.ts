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
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { db } from "../shared/firestore/firestore";
import { auth } from "../shared/firebase/firebase";

export type UserRole = "admin" | "produtor";

type AuthState = {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  hydrated: boolean;
  isSignedIn: boolean;
  isAdmin: boolean;

  hydrate: () => () => void;
  setIsSignedIn: (value: boolean) => void;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      hydrated: false,
      isSignedIn: false,
      isAdmin: false,

      setIsSignedIn: (value: boolean) => {
        set({ isSignedIn: value });
      },

      hydrate: () => {
        const unsub = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const token = await getIdToken(user, true);
            const role = await getUserRole(user.uid);
            set({ user, token, role, hydrated: true, isSignedIn: true, isAdmin: role === "admin" });
          } else {
            set({ user: null, token: null, role: null, hydrated: true, isSignedIn: false, isAdmin: false });
          }
        });

        return unsub;
      },

      signIn: async (email, password) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const token = await getIdToken(cred.user, true);
        const role = await getUserRole(cred.user.uid);
        set({ user: cred.user, token, role, isSignedIn: true, isAdmin: role === "admin" });
      },

      signUp: async (email, password, role, name) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(
          doc(db, "users", cred.user.uid),
          {
            email,
            name: name ?? "",
            role,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );

        const token = await getIdToken(cred.user, true);
        set({ user: cred.user, token, role, isSignedIn: true, isAdmin: role === "admin" });
      },

      resetPassword: async (email) => {
        await sendPasswordResetEmail(auth, email);
      },

      signOut: async () => {
        await fbSignOut(auth);
        set({ user: null, token: null, role: null, isSignedIn: false, isAdmin: false });
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

async function getUserRole(uid: string): Promise<UserRole | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;

  const role = snapshot.data().role;
  if (role === "admin" || role === "produtor") return role;
  return null;
}
