import { useToastStore } from '../stores/useToastStore';

export function useToast() {
  const mostrar = useToastStore((s) => s.mostrar);
  return {
    sucesso: (mensagem: string, titulo?: string) => mostrar({ tipo: 'sucesso', mensagem, titulo }),
    erro: (mensagem: string, titulo?: string) => mostrar({ tipo: 'erro', mensagem, titulo }),
    info: (mensagem: string, titulo?: string) => mostrar({ tipo: 'info', mensagem, titulo }),
  };
}
