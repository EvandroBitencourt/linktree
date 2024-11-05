import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { FormEvent, useState } from "react";
import { auth, db } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (email === "" || password === "") {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      // Cria o usuário com email e senha no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Adiciona os dados do usuário na coleção `users` no Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: email,
        createdAt: new Date(),
      });

      toast.success("Usuário cadastrado com sucesso!");
      navigate("/login", { replace: true }); // Redireciona para a página de login
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("O email já está em uso.");
      } else if (error.code === "auth/weak-password") {
        toast.error("A senha é muito fraca.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("O email é inválido.");
      } else {
        toast.error("Erro ao cadastrar usuário: " + error.message);
      }
      console.error("Erro ao cadastrar usuário: ", error);
    }
  }

  return (
    <div className="flex w-full h-screen items-center justify-center flex-col">
      <Link to="/">
        <h1 className="mt-11 text-white mb-7 font-bold text-5xl">
          Luck
          <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">
            Bet
          </span>
        </h1>
      </Link>

      <form
        onSubmit={handleRegister}
        className="w-full max-w-xl flex flex-col px-2"
      >
        <Input
          placeholder="Digite seu email..."
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="**********"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="h-9 bg-blue-600 rounded border-0 text-lg font-medium text-white mt-4"
        >
          Cadastrar
        </button>
      </form>

      <p className="text-white mt-4">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-blue-400">
          Login
        </Link>
      </p>
    </div>
  );
}
