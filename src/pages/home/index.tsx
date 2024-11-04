import { useEffect, useState } from "react";
import { Social } from "../../components/Social";
import { useParams } from "react-router-dom"; // Para capturar o ID do usuário da URL

import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaArrowRight,
} from "react-icons/fa";
import { db } from "../../services/firebaseConnection";
import {
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc,
  where,
} from "firebase/firestore";

interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

interface SocialLinksProps {
  facebook: string;
  youtube: string;
  instagram: string;
}

export function Home() {
  const { userId } = useParams<{ userId: string }>(); // Captura o ID do usuário da URL
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps>();

  useEffect(() => {
    if (!userId) return;

    async function loadLinks() {
      const linksRef = collection(db, "links");
      const queryRef = query(
        linksRef,
        where("userId", "==", userId), // Filtra pelos links do usuário específico
        orderBy("created", "asc")
      );

      const snapshot = await getDocs(queryRef);
      const lista: LinkProps[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        url: doc.data().url,
        bg: doc.data().bg,
        color: doc.data().color,
      }));

      setLinks(lista);
    }

    loadLinks();
  }, [userId]);

  useEffect(() => {
    // Somente execute `loadSocialLinks` se `userId` estiver definido
    if (!userId) return;

    async function loadSocialLinks() {
      const docRef = doc(db, "social", userId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setSocialLinks({
          facebook: snapshot.data()?.facebook || "",
          instagram: snapshot.data()?.instagram || "",
          youtube: snapshot.data()?.youtube || "",
        });
      }
    }

    loadSocialLinks();
  }, [userId]); // Observe `userId` para garantir que ele esteja definido

  return (
    <div className="flex flex-col w-full py-4 items-center justify-center">
      <img
        src="/assets/images/logo.webp"
        alt="logo do site"
        className="w-24 h-24 rounded-full"
      />

      <h1 className="md:text-4xl  text-3xl font-bold text-white mb-5">
        @flyingwebsites
      </h1>
      <img
        src="/assets/images/banner.png"
        alt="Banner de anuncio"
        className="w-full max-w-[350px] h-auto object-cover"
      />
      <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇</span>

      <main className="flex flex-col w-11/12 max-w-xl text-center">
        {links.map((link) => (
          <section
            style={{ backgroundColor: link.bg }}
            key={link.id}
            className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer flex flex-row justify-between items-center"
          >
            <a
              href={link.url}
              target="_blank"
              className="flex items-center w-full px-4"
            >
              <img
                src="/assets/images/logo.webp"
                alt="Logo"
                className="w-12 h-12 rounded-full object-cover" // Diminuí o tamanho da imagem
              />
              <p
                className="text-base md:text-lg mx-4 flex-grow text-center"
                style={{ color: link.color }}
              >
                {link.name}
              </p>
              <FaArrowRight size={24} color={link.color} />{" "}
              {/* Ícone de seta indicando clique */}
            </a>
          </section>
        ))}

        {socialLinks && Object.keys(socialLinks).length > 0 && (
          <footer className="flex justify-center gap-3 my-4">
            {socialLinks.facebook && (
              <Social url={socialLinks.facebook}>
                <FaFacebook size={35} color="#FFF" />
              </Social>
            )}
            {socialLinks.youtube && (
              <Social url={socialLinks.youtube}>
                <FaYoutube size={35} color="#FFF" />
              </Social>
            )}
            {socialLinks.instagram && (
              <Social url={socialLinks.instagram}>
                <FaInstagram size={35} color="#FFF" />
              </Social>
            )}
          </footer>
        )}
      </main>
    </div>
  );
}
