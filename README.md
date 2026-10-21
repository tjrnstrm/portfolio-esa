# ESA

Portfolio site for Emelie Strand Adolfsson, a game audio designer.

The home page is one screen: the logo in the middle with a **Play showreel**
button under it, and a row of discs along the bottom under **Portfolio**.
Click a disc and everything else fades out, leaving the video, a few lines
about the work, the disc spinning beside the controls, and a round ✕ in the
corner. There are two more pages, **About** and **Contact**.

```bash
npm run dev     # http://localhost:3000
npm run build
```

Next.js 16 (App Router), React 19, CSS Modules. This version of Next has
breaking changes from older ones; see `AGENTS.md`.

## The file you edit

**`app/content/projects.ts`**. What the site says lives here: the discs,
the showreel, the background music, the nav links, the About and Contact
text, the contact email and the CV link.

- **Add or change a disc:** edit the `discs` list at the bottom. One block
  per disc, in the order they're shown. `title` goes under the disc and
  `meta` (optional) is the category it turns into on hover. `poster` is the
  disc art, `video` the clip, and `info` the lines shown beside the player.
  `nominee: true` adds the small gold star after the title.
  `letterbox: { bar: 36, of: 1080 }` is for a video with black bars baked
  into its top and bottom (Metroid has them): the player zooms in just enough
  to hide them. Showreel chapters take it too, per clip.
- **Showreel:** `showreel` is its own disc and also the button under the
  logo. Its `chapters` list changes the info beside the player as the reel
  moves between clips: one entry per clip with the time it starts (`'0:25'`).
  Update `length` when the reel is re-exported. It's the time on the button.
- **Background music:** `site.music`. Nothing plays until a visitor picks a
  track from **Play BGM** in the header.
- **About / Contact text:** `site.about`, `site.contact`. The nomination box
  on About is `site.nomination`.

Media goes in `public/` (see `public/README.md` for encoding).

## Layout

```
app/
  content/projects.ts          ← edit this
  page.tsx                     home: renders Hero with the discs
  about/ contact/              the two other pages
  contact/actions.ts           server action that sends the form (Resend)
  components/hero/
    HeroStage.tsx              the home page's state: what's playing, info
    Intro.tsx                  logo + Play showreel, centred on the screen
    Shelves.tsx  Disc.tsx      the "Portfolio" row of discs
    Background.tsx             blurred preview behind, and the playing video
    VideoControls.tsx          play/pause and the timeline
    SiteNav.tsx                header: nav links (desktop) / menu (phone);
                               rendered once in layout.tsx so it doesn't blur
                               when pages change
    MusicPicker.tsx            Play BGM: track list, mute and volume
    useMusicPlayer.tsx         the one audio element: tracks, volume, fades
    Sparkle.tsx                the gold award star
  layout.tsx  template.tsx     fonts, page title, page transitions
public/
  discs/  video/  music/  documents/  img/
```

## The contact form

The form sends straight from the site through [Resend](https://resend.com),
using a server action (`app/contact/actions.ts`). It needs two environment
variables:

```
RESEND_API_KEY=re_...                                    # sending access is enough
CONTACT_FROM="ESA Portfolio <contact@esa-audio.se>"      # must be on a domain verified in Resend
```

Locally, put them in `.env.local` (git ignores it; `.env.example` shows the
shape). On Vercel, add the same two under Project Settings → Environment
Variables and **redeploy**, since variables are only read at deploy time.
Mail goes to `site.email`, with the visitor's address as reply-to, so
answering is just hitting Reply. If sending fails, the form keeps what was
typed and tells the visitor to email directly; the real reason is in the
server log (Vercel → Logs).

## Decisions worth knowing before changing them

**The first impression is silent.** Browsers block autoplay with sound, so
the music is off until someone chooses a track. That click is also what lets
the browser play it. The volume is remembered between visits.

**Videos fade the music, relative to the listener's volume.** Playing a disc
ramps the music down, and closing it ramps back up to the level they chose,
not to full. On iPhones, which ignore volume set by a page, silence also sets
`muted`, which iOS does respect.

**One audio element lives above the page template** (`useMusicPlayer`), so
the track keeps playing across page changes instead of restarting.

**Height is `100svh`.** On iOS, `100vh` measures against browser chrome that
then slides away, cropping the bottom of the screen, exactly where the discs
are. On very short screens (landscape phones) the page scrolls instead of
overlapping.

**The logo is centred on the whole screen,** not on the space between header
and discs. `Intro.tsx` measures it and shifts it, but never so far that it
runs into the header or the discs. That's why it fades in a moment after load.

**Fonts are self-hosted** via `next/font`, fetched at build time. Nothing
goes to Google at runtime, which keeps visitor IPs out of Google's hands,
the GDPR question a plain Google Fonts `<link>` raises for an EU site. The
build needs network access to fetch them once; in a restricted CI, swap to
`next/font/local` with the .woff2 files committed.

## Handing it over

"Add this video to the homepage" is one block in one file. Prompts that
work cleanly:

- *"Add a disc called X, with video /video/x.webm and art /discs/x.webp"*
- *"Make the Showreel's info change to ... at 0:50"*
- *"Move Metroid Prime to be the last disc"*
- *"Change the email on the Contact page to ..."*

Each is a change to `app/content/projects.ts` and nothing else.
