"use client";

import SiteNav from "./SiteNav";
import { useMusicPlayer } from "./useMusicPlayer";

/** The shared music-enabled header used on standalone pages. */
export default function PageMusicHeader() {
  const {
    music,
    musicPaused,
    musicChanging,
    toggleMusic,
    changeMusic,
  } = useMusicPlayer();

  return (
    <SiteNav
      music={music}
      musicPaused={musicPaused}
      musicChanging={musicChanging}
      onToggleMusic={toggleMusic}
      onChangeMusic={changeMusic}
    />
  );
}
