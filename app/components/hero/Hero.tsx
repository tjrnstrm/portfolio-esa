import type { Project } from "../../content/projects";
import HeroStage from "./HeroStage";
import Intro from "./Intro";

/* The intro never changes, so it stays a Server Component and is handed to
   the client-side stage as a slot instead of being bundled into it. */
export default function Hero({ projects }: { projects: Project[] }) {
  return <HeroStage projects={projects} intro={<Intro />} />;
}
