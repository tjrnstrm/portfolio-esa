import Hero from "./components/hero/Hero";
import { shelves } from "./content/projects";

export default function Home() {
  return <Hero shelves={shelves} />;
}
