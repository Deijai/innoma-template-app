import { useAuthStore } from "@/src/stores/useAuthStore";
import { useToastStore } from "@/src/stores/useToastStore";
import { useRouter } from "expo-router";
import { useState } from "react";

type Errors = {
  email?: string;
  password?: string;
};

function friendlyAuthError(code?: string) {
  switch (code) {
    case "auth/invalid-email":
      return "E-mail inválido";
    case "auth/user-not-found":
      return "Usuário não encontrado";
    case "auth/wrong-password":
      return "Senha incorreta";
    case "auth/invalid-credential":
      return "Credenciais inválidas";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente mais tarde";
    default:
      return "Não foi possível entrar. Tente novamente";
  }
}

export function useSignInVM() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Errors = {};
    if (!email) e.email = "E-mail obrigatório";
    else if (!email.includes("@")) e.email = "E-mail inválido";

    if (!password) e.password = "Senha obrigatória";
    else if (password.length < 6) e.password = "Mínimo 6 caracteres";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);
      await signIn(email, password);
      useToastStore.getState().show("Bem-vindo!", "success");
      router.replace("/(tabs)/home");
    } catch (err: any) {
      const msg = friendlyAuthError(err?.code);
      useToastStore.getState().show(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    submit,
  };
}
