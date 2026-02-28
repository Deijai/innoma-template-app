import { create } from 'zustand';

type State = {
  visível: boolean;
  mensagem?: string;
  mostrar: (mensagem?: string) => void;
  esconder: () => void;
};

export const useAppLoadingStore = create<State>((set) => ({
  visível: false,
  mensagem: undefined,
  mostrar: (mensagem) => set({ visível: true, mensagem }),
  esconder: () => set({ visível: false, mensagem: undefined }),
}));
