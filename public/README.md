# Assets

**`/discs`**: the art for each disc, a square image shown as a circle.
Anything around 600px is plenty. Referenced in `app/content/projects.ts`
as `poster: '/discs/name.webp'`. `.webp` is smallest, but `.jpg` and `.png`
work too.

**`/video`**: one clip per disc, plus the showreel. Referenced as
`video: '/video/name.webm'`. Each one plays with sound when its disc is
clicked, so there's nothing separate to export for the blurred preview
behind the home page; that's a still from the disc art.

**`/music`**: the background tracks, listed in `site.music` in
`app/content/projects.ts`. Nothing plays until a visitor picks one from
**Play BGM** in the header; browsers block sound before a click. They're
AAC `.m4a` at 256 kbps (about a tenth the size of the WAV masters, which
live outside the repo in `../esa-audio-masters`). To add a track:

    ffmpeg -i "Track.wav" -c:a aac -b:a 256k -movflags +faststart track.m4a

**`/documents`**: the CV (PDF). Linked from Contact as `site.resume`; it
opens in the browser's PDF viewer, not as a download.

**`/img`**: the logo, the About portrait and the LinkedIn mark.

Filenames: lowercase or plain, no spaces, **no å ä ö**. `skogsmiljö ljud.webm`
breaks URLs in ways that are miserable to debug.

## Encoding video

The clips are VP9 `.webm`. 1280px is plenty, and under about 35 MB each
keeps the site quick (the showreel runs longest). Whatever you export from,
the result needs to be a `.webm` the browser can seek in, so the timeline and
the showreel's per-clip info work.

    ffmpeg -i capture.mov -vf "scale=1280:-2" \
      -c:v libvpx-vp9 -crf 33 -b:v 0 -row-mt 1 \
      -c:a libopus -b:a 128k project.webm

After re-exporting the **showreel**, check its length (right-click the file
→ Properties → Details) and update `length` and the `chapters` times in
`app/content/projects.ts` if the clips moved.

## Favicon

`app/favicon.ico`, `app/icon.png` and `app/apple-icon.png` are the A with
the vinyl from the logo, cream on the site's dark colour. Next.js picks them
up from `app/` automatically. Browsers cache favicons hard, so a change can
take a restart to show.
