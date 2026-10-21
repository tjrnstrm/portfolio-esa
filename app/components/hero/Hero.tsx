import type { Project } from "../../content/projects";
import HeroStage from "./HeroStage";

export default function Hero({ discs }: { discs: Project[] }) {
  return <HeroStage discs={discs} />;
}
