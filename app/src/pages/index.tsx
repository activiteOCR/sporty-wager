import { Navbar } from "@/components/Navbar";
import { MyExpenses } from "@/components/MyExpenses";
import { DefaultHead } from "@/components/DefaultHead";
import Gallery from "@/components/Gallery"; // Import du nouveau composant Gallery

// Définir les images à passer à Gallery
const images = [
  {
    src: "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
    title: "Image 1",
    description: "Description for Image 1",
  },
  {
    src: "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
    title: "Image 2",
    description: "Description for Image 2",
  },
  {
    src: "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
    title: "Image 3",
    description: "Description for Image 3",
  },
  {
    src: "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
    title: "Image 4",
    description: "Description for Image 4",
  },
];

export default function Home() {
  return (
    <>
      <DefaultHead />
      <Navbar />
      <Gallery images={images} /> {/* Ajout du composant Gallery */}
      <MyExpenses />
    </>
  );
}
