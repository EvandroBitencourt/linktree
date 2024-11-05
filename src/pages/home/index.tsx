import { useEffect, useState } from "react";
import { Social } from "../../components/Social";

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
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps>();

  useEffect(() => {
    async function loadLinks() {
      const linksRef = collection(db, "links");
      const queryRef = query(linksRef, orderBy("created", "asc"));

      const snapshot = await getDocs(queryRef);
      let lista = [] as LinkProps[];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color,
        });
      });

      setLinks(lista);
    }

    loadLinks();
  }, []);

  useEffect(() => {
    async function loadSocialLinks() {
      const docRef = doc(db, "social", "link");
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
  }, []);

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
                className="w-12 h-12 rounded-full object-cover"
              />
              <p
                className="text-base md:text-lg mx-4 flex-grow text-center"
                style={{ color: link.color }}
              >
                {link.name}
              </p>
              <FaArrowRight size={24} color={link.color} />
            </a>
          </section>
        ))}

        {socialLinks && Object.keys(socialLinks).length > 0 && (
          <footer className="flex justify-center gap-3 my-4">
            <Social url={socialLinks?.facebook}>
              <FaFacebook size={35} color="#FFF" />
            </Social>

            <Social url={socialLinks?.youtube}>
              <FaYoutube size={35} color="#FFF" />
            </Social>

            <Social url={socialLinks?.instagram}>
              <FaInstagram size={35} color="#FFF" />
            </Social>
          </footer>
        )}
      </main>
    </div>
  );
}
