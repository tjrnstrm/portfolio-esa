/* ────────────────────────────────────────────────────────────────
   THIS IS THE FILE TO EDIT.

   Everything the homepage shows comes from here. Changing the site
   means changing this file — nothing else needs touching.

   To add a project: copy one block inside a shelf's `projects` and fill
   it in. To reorder a shelf: move blocks up or down. To remove one:
   delete its block.
   ──────────────────────────────────────────────────────────────── */

export type Project = {
  /** Shown under the disc. */
  title: string;
  /** One sentence about the work. Read out to screen readers. */
  note: string;
  /** The disc's artwork. Put the file in /public/discs/ and write "/discs/name.webp" */
  poster: string;
  /** Video file. Put it in /public/video/ and write "/video/name.webm". */
  video: string;
  /** Colour of the label in the middle of the disc. Optional. */
  labelColor?: string;
  /** Shows a "Nominee" pill on the disc (the award text is `site.award`). */
  nominee?: boolean;
  /** A few lines about the work, shown beside the player while it plays. */
  info?: ProjectInfo;
  /** For a video made of several clips (the showreel): what to show from
   *  each point in the video. Each entry shows from its `at` time until
   *  the next one starts. Overrides `info` while the video plays. */
  chapters?: Chapter[];
};

export type Chapter = {
  /** When this clip starts, as minutes:seconds, e.g. "0:24". */
  at: string;
  info: ProjectInfo;
};

export type ProjectInfo = {
  /** The game's name, shown largest. */
  game: string;
  /** Short facts, one per line. e.g. "Sound re-design" */
  lines: string[];
  /** What I did on it. Shown after a "My work" label. Optional. */
  work?: string;
  /** An award or nomination, shown with a sparkle. Optional. */
  award?: string;
};

export type Shelf = {
  title: string;
  projects: Project[];
};

export type MusicTrack = {
  src: string;
  /** Track name, e.g. "Sewers". */
  title: string;
  /** Colour of the label on the track's disc in the music menu. */
  labelColor: string;
};

export const site = {
  name: 'ESA',
  /** What the initials stand for. Shown tiny, right under the name. */
  fullName: 'Emelie Strand Adolfsson',
  statement: 'Sound design and implementation for games',
  /** The role line, shown under the heading on the About page. */
  stack: 'Sound Designer · Musician · Composer',
  /** One sentence; it wraps itself, so no manual line breaks. Shown when
   *  hovering a nominee disc, and read out to screen readers. */
  award:
    'Nominated for Best Audio and Game of the Year at the Swedish Game Awards 2026',
  /** The nomination box on the About page. */
  nomination: {
    kicker: 'Nominated · Swedish Game Awards 2026',
    detail: 'Best Audio and Game of the Year, for Bony Tony: The Revenge.',
  },

  /** Shown inside the Contact dropdown/panel, on both desktop and phone. */
  email: 'emelie@creekroad.se',
  linkedin: 'https://www.linkedin.com/in/emelie-strand-adolfsson-6057b0401/',
  /** The CV, linked under LinkedIn on Contact. Opens in the browser's PDF
   *  viewer in a new tab. Put the file in /public/documents/. */
  resume: '/documents/Emelie_Strand_Adolfsson_CV_English_2026.pdf',

  /** Background music. Nothing plays until the visitor picks a track from
   *  "Play music" in the header; the choice carries across pages. */
  musicAlbum: 'Bony Tony: The Revenge',
  music: [
    { src: '/music/BTR - Sewers.wav', title: 'Sewers', labelColor: '#2f5e4a' },
    { src: '/music/BTR - Casino.wav', title: 'Casino', labelColor: '#7a2532' },
  ] satisfies MusicTrack[],

  /** The links in the top bar and hamburger menu. */
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],

  about: {
    heading: 'Hi I\u2019m Emelie!',
    points: [
      'Student at Audio Production Academy: Sound Design, Composing and Implementation.',
      'Over 16 years experience as a musician. I play a bunch of different saxophones, drums and percussion.',
      'Skills: Cubase, Logic Pro, Reaper, Wwise, FMOD, Unity and Unreal Engine.',
      'Have worked over 9 years in the restaurant business. Both on land and water.',
      'Outside of gaming and music I have a huge interest in books and reading.',
      'Favorite games right now: Myst and Palia.',
    ],
  },

  contact: {
    heading: 'Let\u2019s make some noise.',
    intro:
      'Have a game, film or audio project in mind? Send me a message and tell me what you are working on.',
  },
};

const bonyTonyInfo: ProjectInfo = {
  game: 'Bony Tony: The Revenge',
  lines: ['2.5D platforming game', 'Student project between APA and TGA'],
  work: 'Ambient sound design and saxophone playing, with composing input.',
  award: 'SGA New Talent 2026: nominated for Best Audio and Game of the Year',
};

/** Played by the "Play showreel" button under the logo, and by its disc
 *  on the My Work shelf. `length` is the label on that button. */
export const showreel: Project & { length: string } = {
  title: 'Showreel',
  note: 'Two minutes of the work, cut for people with thirty seconds.',
  poster: '/discs/logo.webp',
  video: '/video/showreel.webm',
  length: '1:21',
  /* The info beside the player changes as the reel moves between clips:
     each entry shows from its time until the next one starts. */
  chapters: [
    {
      at: '0:00',
      info: {
        game: 'Bony Tony: The Revenge',
        lines: [],
        work: bonyTonyInfo.work,
        award: bonyTonyInfo.award,
      },
    },
    {
      at: '0:25',
      info: { game: 'Elden Ring: Godfrey Boss Fight', lines: ['Sound re-design'] },
    },
    {
      at: '0:46',
      info: { game: 'Metroid Prime: Remastered', lines: ['Sound re-design'] },
    },
  ],
};

/** The two rows of discs at the bottom of the home page. */
export const shelves: Shelf[] = [
  {
    title: 'Audio design',
    projects: [
      {
        title: 'Metroid Prime',
        note: 'A sound redesign focused on atmosphere, movement, and combat.',
        poster: '/discs/metroid.webp',
        video: '/video/MetroidPrime.webm',
        info: { game: 'Metroid Prime: Remastered', lines: ['Sound re-design'] },
      },
      {
        title: 'Battlefield',
        note: 'A focused selection of weapon and combat sound design.',
        poster: '/discs/Battlefield.webp',
        video: '/video/Battlefield.webm',
        info: { game: 'Battlefield 3', lines: ['Sound re-design'] },
      },
    ],
  },
  {
    title: 'My Work',
    projects: [
      showreel,
      {
        title: 'Bony Tony',
        note: 'Ambient sound design and saxophone for Bony Tony: The Revenge.',
        poster: '/discs/BonyTony.png',
        video: '/video/BonyTony.webm',
        nominee: true,
        info: bonyTonyInfo,
      },
    ],
  },
];
