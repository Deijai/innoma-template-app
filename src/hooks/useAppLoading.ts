import { useAppLoadingStore } from '../stores/useAppLoadingStore';

export function useAppLoading() {
  const mostrar = useAppLoadingStore((s) => s.mostrar);
  const esconder = useAppLoadingStore((s) => s.esconder);
  return { mostrar, esconder };
}
