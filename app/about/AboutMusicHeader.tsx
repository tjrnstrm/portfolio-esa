"use client";

import SiteNav from "../components/hero/SiteNav";
import { useMusicPlayer } from "../components/hero/useMusicPlayer";

export default function AboutMusicHeader() {
  const {
    musicRef,
    music,
    musicPaused,
    musicChanging,
    toggleMusic,
    changeMusic,
  } = useMusicPlayer(1);

  return (
    <>
      {music ? <audio ref={musicRef} src={music.src} loop preload="auto" /> : null}
      <SiteNav
        music={music}
        musicPaused={musicPaused}
        musicChanging={musicChanging}
        onToggleMusic={toggleMusic}
        onChangeMusic={changeMusic}
      />
    </>
  );
}
