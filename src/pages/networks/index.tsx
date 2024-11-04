import { useState, FormEvent, useEffect } from "react";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { db, auth } from "../../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

export function Networks() {
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Obter o `uid` do usuário autenticado
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        loadLinks(user.uid); // Carrega as redes sociais do usuário autenticado
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  function loadLinks(uid: string) {
    const docRef = doc(db, "social", uid);
    getDoc(docRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setFacebook(data?.facebook || "");
          setInstagram(data?.instagram || "");
          setYoutube(data?.youtube || "");
        }
      })
      .catch((error) => {
        console.log("Erro ao carregar as redes sociais:", error);
      });
  }

  function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (!userId) {
      console.log("Usuário não autenticado");
      return;
    }

    setDoc(doc(db, "social", userId), {
      facebook: facebook,
      instagram: instagram,
      youtube: youtube,
    })
      .then(() => {
        console.log("Links das redes sociais cadastrados com sucesso!");
      })
      .catch((error) => {
        console.log("Erro ao salvar os links: ", error);
      });
  }

  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Header />

      <h1 className="text-white text-2xl font-medium mt-8 mb-4">
        Minhas redes sociais
      </h1>

      <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
        <label className="text-white font-medium mt-2 mb-2">
          Link do Facebook
        </label>
        <Input
          type="url"
          placeholder="Digite a url do Facebook..."
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />

        <label className="text-white font-medium mt-2 mb-2">
          Link do Instagram
        </label>
        <Input
          type="url"
          placeholder="Digite a url do Instagram..."
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />

        <label className="text-white font-medium mt-2 mb-2">
          Link do YouTube
        </label>
        <Input
          type="url"
          placeholder="Digite a url do YouTube..."
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
        />

        <button
          type="submit"
          className="text-white bg-blue-600 h-9 rounded-md items-center justify-center flex mb-7 font-medium"
        >
          Salvar links
        </button>
      </form>
    </div>
  );
}
