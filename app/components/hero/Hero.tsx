import type { Shelf } from "../../content/projects";
import HeroStage from "./HeroStage";

export default function Hero({ shelves }: { shelves: Shelf[] }) {
  return <HeroStage shelves={shelves} />;
}
