/* ────────────────────────────────────────────────────────────────
   THIS IS THE FILE TO EDIT.

   Everything the homepage shows comes from here. Changing the site
   means changing this file — nothing else needs touching.

   To add a project: copy one block inside `projects` and fill it in.
   To reorder the rack: move blocks up or down.
   To remove one: delete its block.
   ──────────────────────────────────────────────────────────────── */

export type Project = {
  /** Shown under the disc, and large on screen while it plays. */
  title: string;
  /** One short line: role, tool, length. e.g. "Wwise · combat layer" */
  meta: string;
  /** One sentence about the work. Shown while it plays. */
  note: string;
  /** Still image. Put the file in /public/posters/ and write "/posters/name.jpg" */
  poster: string;
  /** Video file. Put it in /public/video/ and write "/video/name.webm".
   *  Leave as "" until the video exists — the poster shows on its own. */
  video: string;
};

export type MusicTrack = {
  src: string;
  title: string;
};

export const site = {
  name: 'ESA',
  /** What the initials stand for. Shown tiny, right under the name. */
  fullName: 'Emelie Strand Adolfsson',
  statement: 'Sound design and implementation for games',
  /** The tech stack line, shown just under the statement. */
  stack: 'Sound Designer · Musician · Composer',
  award:
    'Nominated for Best Audio and game of the year\nat the Swedish Game Awards 2026',

  /** Shown inside the Contact dropdown/panel, on both desktop and phone. */
  email: 'emelie@creekroad.se',
  linkedin: 'https://www.linkedin.com/in/emelie-strand-adolfsson-6057b0401/',

  /** Plays low behind the rack while browsing. Clicking the title chooses
   *  another entry at random without immediately repeating the current one. */
  music: [
    {
      src: '/music/BTR - Sewers.wav',
      title: 'Bony Tony: The Revenge — Sewers',
    },
    {
      src: '/music/BTR - Casino.wav',
      title: 'Bony Tony: The Revenge — Casino',
    },
  ] satisfies MusicTrack[],

  /** The plain links in the top bar / hamburger menu. Contact isn't listed
   *  here — it's its own dropdown/panel (see `email` and `linkedin`
   *  above), the same on desktop and phone. */
  nav: [
    { label: 'My Sound', href: '/#work' },
    { label: 'About', href: '/about' },
  ],

  about: {
    heading: 'Hi I\u2019m Emelie!',
    points: [
      'Student at Audio Production Academy: Sound Design, Composing and Implementation.',
      'Over 16 years experience as a musician. I play a bunch of different saxophones, drums and percussion.',
      'Skills: Cubase, Logic Pro, Reaper, Wwise, FMOD, Unity and Unreal Engine.',
      'Have worked over 9 years in the restaurant business. Both on land and water.',
      'Outside of gaming and music I have a huge interest in books and reading.',
    ],
  },
};

export const projects: Project[] = [
  {
    title: 'Showreel 2026',
    meta: 'Showreel',
    note: 'Two minutes of the work, cut for people with thirty seconds.',
    poster: '/discs/logo.webp',
    video: '/video/showreel.webm',
  },
  {
    title: 'Bony Tony',
    meta: 'Game audio',
    note: 'Sound design and implementation for Bony Tony: The Revenge.',
    poster: '/discs/BonyTony.png',
    video: '/video/BonyTony.webm',
  },
  {
    title: 'Metroid Prime',
    meta: 'Sound redesign',
    note: 'A sound redesign focused on atmosphere, movement, and combat.',
    poster: '/discs/metroid.webp',
    video: '/video/MetroidPrime.webm',
  },
  {
    title: 'Battlefield',
    meta: 'Sound design',
    note: 'A focused selection of weapon and combat sound design.',
    poster: '/discs/Battlefield.webp',
    video: '/video/Battlefield.webm',
  },
];
