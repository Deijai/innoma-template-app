import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import type { FarmFilters } from '../types';
import { defaultFilters, useFarmFiltersStore } from '../../../stores/useFarmFiltersStore';

export function useFarmFiltersVM() {
  const router = useRouter();
  const appliedFilters = useFarmFiltersStore((state) => state.filters);
  const setFilters = useFarmFiltersStore((state) => state.setFilters);

  const [draft, setDraft] = useState<FarmFilters>(appliedFilters);

  const hasChanges = useMemo(() => JSON.stringify(draft) !== JSON.stringify(appliedFilters), [appliedFilters, draft]);

  const update = <K extends keyof FarmFilters>(key: K, value: FarmFilters[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const apply = () => {
    setFilters({
      ...draft,
      cidade: draft.cidade.trim(),
    });
    router.back();
  };

  const clear = () => {
    setDraft(defaultFilters);
  };

  return {
    draft,
    hasChanges,
    update,
    apply,
    clear,
    close: () => router.back(),
  };
}
