import { create } from "zustand";

type ToastType = "success" | "error" | "info";

type ToastState = {
  visible: boolean;
  message: string;
  title?: string;
  type: ToastType;
  show: (params: { tipo: string; mensagem: string; titulo?: string }) => void;
  hide: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: "",
  type: "info",

  show: ({ tipo, mensagem, titulo }) => {
    const typeMap: Record<string, ToastType> = {
      sucesso: 'success',
      erro: 'error',
      info: 'info'
    };
    set({ visible: true, message: mensagem, title: titulo, type: typeMap[tipo] || 'info' });
  },
  hide: () => set({ visible: false }),
}));