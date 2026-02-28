import { useMemo, useState } from 'react';

function isEmail(v: string) {
  const s = v.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function useResetPasswordVM() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);

  const error = useMemo(() => {
    if (!touched) return undefined;
    if (!isEmail(email)) return 'Enter a valid email.';
    return undefined;
  }, [email, touched]);

  const canSubmit = isEmail(email) && !loading;

  async function submit() {
    setTouched(true);
    if (!isEmail(email)) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return { email, setEmail, loading, sent, error, canSubmit, submit };
}
