import { useAuthStore } from "@/src/stores/useAuthStore";
import { useToastStore } from "@/src/stores/useToastStore";
import { useRouter } from "expo-router";
import { useState } from "react";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

function friendlyAuthError(code?: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Esse e-mail já está em uso";
    case "auth/invalid-email":
      return "E-mail inválido";
    case "auth/weak-password":
      return "Senha fraca (use pelo menos 6 caracteres)";
    default:
      return "Não foi possível criar sua conta. Tente novamente";
  }
}

export function useSignUpVM() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Errors = {};

    if (!name) e.name = "Nome obrigatório";

    if (!email) e.email = "E-mail obrigatório";
    else if (!email.includes("@")) e.email = "E-mail inválido";

    if (!password) e.password = "Senha obrigatória";
    else if (password.length < 6) e.password = "Mínimo 6 caracteres";

    if (!confirmPassword) e.confirm = "Confirme sua senha";
    else if (confirmPassword !== password) e.confirm = "Senhas não conferem";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);
      await signUp(email, password);

      useToastStore.getState().show("Conta criada! Bem-vindo 👋", "success");
      router.replace("/(auth)/sign-in");
    } catch (err: any) {
      useToastStore.getState().show(friendlyAuthError(err?.code), "error");
    } finally {
      setLoading(false);
    }
  }

  function goToLogin() {
    //router.replace("/(auth)/login");
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    submit,
    goToLogin,
    name,
    setName,
  };
}
