import { Navbar } from "@/components/Navbar";
import { MyExpenses } from "@/components/MyExpenses";
import { DefaultHead } from "@/components/DefaultHead";
import Gallery from "@/components/Gallery";
import { Swap } from "@/components/Swap";
import MintButton from "@/components/MintButton";

// Définir les images à passer à Gallery
const images = [
  {
    src: "https://i.postimg.cc/hjNL174N/NFL.webp",
    title: "LION VS HAWKS",
    description: "1.65 | 3.2 | 2.81",
  },
  {
    src: "https://i.postimg.cc/W3KyqnDZ/NHL.webp",
    title: "WOLVES VS EAGLES",
    description: "2.88 | 3.64 | 1.71",
  },
  {
    src: "https://i.postimg.cc/MpVz6nFt/MLB.webp",
    title: "TIGERS VS SHARKS",
    description: "1.25 | 4.42 | 3.33",
  },
  {
    src: "https://i.postimg.cc/MH18W4sH/NBA.webp",
    title: "CELTICS VS BULLS",
    description: "1.55 | 3.78 | 2.98",
  },
];

export default function Home() {
  return (
    <>
      <DefaultHead />
      <Navbar />
      <Gallery images={images} />
      <Swap />
      <MyExpenses images={images} />
      <MintButton />
    </>
  );
}
