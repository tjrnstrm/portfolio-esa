import Hero from "./components/hero/Hero";
import { discs } from "./content/projects";

export default function Home() {
  return <Hero discs={discs} />;
}
