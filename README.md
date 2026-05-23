# Spin Decide

A web-based spinner wheel for making random choices. Create grouped lists like "Movies" or "Dinners", add options, spin the wheel, and decide whether to keep or remove the winner.

All data is stored locally in your browser — no account or database required.

## Features

- **Named lists** — organize options into separate groups
- **Add & remove items** — edit lists freely before spinning
- **Animated wheel** — colorful Wheel-of-Names-style spinner
- **Celebration sound** — optional chime when a winner is picked (toggle mute anytime)
- **Keep or remove** — after each spin, remove the winner or spin again
- **Local persistence** — lists survive page reloads via `localStorage`

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Live demo

The app is published automatically from the `main` branch at:

**https://pdilillo.github.io/spinner-app/**

Pushing to `main` triggers a GitHub Actions workflow that builds and deploys the site. You do not need to run a separate deploy command for routine updates.

## Usage

### Create a list

1. On the home screen, type a name in the **New list name** field (e.g. "Dinners").
2. Click **+ New list**.
3. You are taken straight into that list's editor.

### Add items to the spinner

1. Open a list from the home screen (or create a new one).
2. In the **Items** panel on the left, type an option in the **Add an option…** field.
3. Click **Add** (or press Enter).
4. Repeat until you have at least **2 items** — the wheel needs two or more options before it can spin.

Each item appears in a numbered list below the input. You can add as many items as you like.

> **Note:** While the wheel is spinning or showing a result, adding items is temporarily disabled until you choose **Keep & spin again** or **Remove from list**.

### Remove items from the spinner

There are two ways to remove an item:

**Before spinning**

1. Open the list.
2. Find the item in the numbered list.
3. Click the **✕** button on the right side of that row.

**After a spin (remove the winner)**

1. When the wheel stops, a result dialog shows the winning option.
2. Click **Remove from list** to delete that item and return to the editor.
3. Or click **Keep & spin again** if you want to leave the item on the list.

You can also press **Escape** to keep the winner and close the dialog.

### Spin the wheel

1. Make sure the list has at least 2 items.
2. Click **SPIN** on the right side of the screen.
3. When the wheel stops, choose whether to remove the winner or keep it and spin again.

### Manage lists

| Action | How |
|--------|-----|
| Open a list | Click its card on the home screen |
| Go back to all lists | Click **← Back** in the list editor |
| Delete a list | Hover a list card → **Delete** → confirm |
| Mute/unmute sound | Click the speaker icon in the list editor header |

### Tips

- Lists and items are saved automatically in your browser. Clearing site data will reset everything.
- If only one item remains, you'll see a reminder to add another before spinning again.
- After a spin, you must pick **Remove from list** or **Keep & spin again** before you can spin again.

## Build for production

```bash
npm run build
npm run preview
```

The `dist/` folder is a static site you can deploy to [Vercel](https://vercel.com), [Netlify](https://netlify.com), or GitHub Pages.

## Deploy to GitHub Pages

This repo includes a workflow at `.github/workflows/deploy.yml` that builds and publishes the site to GitHub Pages.

### Updating the live site (automatic)

For day-to-day changes, deployment is automatic:

1. Commit your changes locally
2. Push to the `main` branch
3. GitHub Actions runs **Deploy to GitHub Pages** (build → upload artifact → deploy)
4. The live site updates after the workflow finishes (usually 1–2 minutes)

You can watch progress under the repo’s **Actions** tab. When the run is green, the update is live.

To deploy without new commits, open **Actions → Deploy to GitHub Pages → Run workflow** (this uses the `workflow_dispatch` trigger).

### One-time setup (new repo or fork)

If you fork this project or create a new GitHub repo, do this once:

1. Push the code to GitHub
2. In the repo, go to **Settings → Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**
4. Update `base` in `vite.config.ts` to match your repo name (for example, `/my-repo-name/`). GitHub Pages serves user/organization sites at `https://<username>.github.io/<repo-name>/`
5. Push to `main` to trigger the first deploy

After that, every push to `main` redeploys automatically.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite — no config needed
4. Deploy

## Project structure

```
spinner-wheel/
├── public/              # Static assets (favicon)
├── src/
│   ├── components/      # React UI
│   │   ├── ListHub.tsx      # Home screen — create/open/delete lists
│   │   ├── ListEditor.tsx   # List view — add items, spin, results
│   │   ├── ItemList.tsx     # Numbered item list with remove buttons
│   │   ├── SpinWheel.tsx    # SVG wheel animation
│   │   ├── ResultModal.tsx  # Post-spin keep/remove dialog
│   │   ├── Confetti.tsx     # Winner celebration effect
│   │   └── SoundToggle.tsx  # Mute/unmute control
│   ├── hooks/
│   │   ├── useSpinWheel.ts       # Spin state, rotation, winner selection
│   │   └── useCelebrationSound.ts # Web Audio celebration chime
│   ├── store/
│   │   └── useSpinnerStore.ts    # Zustand store + localStorage persistence
│   ├── types/
│   │   └── index.ts              # SpinnerList, SpinnerItem, AppSettings
│   ├── utils/
│   │   ├── wheelGeometry.ts      # SVG slice math
│   │   └── id.ts                 # Unique ID helper
│   ├── App.tsx            # Routes between ListHub and ListEditor
│   ├── index.css          # Tailwind + global styles
│   └── main.tsx           # React entry point
├── index.html
├── vite.config.ts
└── package.json
```

## How data is stored

Lists are persisted in the browser under the `localStorage` key `spinner-app-v1`. Each list contains:

- A name and unique ID
- An array of items (`{ id, label }`)
- Created/updated timestamps

Settings (sound on/off, last opened list) are stored in the same snapshot.

## Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Key modules

- **`useSpinnerStore`** — central state for lists, items, and settings. Exposes `addItem`, `removeItem`, `createList`, and related actions.
- **`useSpinWheel`** — manages spin phases (`idle` → `spinning` → `result`), wheel rotation, and random winner selection.
- **`ListEditor`** — wires the store, spin hook, item form, and result modal together.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Zustand (with `localStorage` persistence)
- SVG wheel with CSS transform animation
- Web Audio API for celebration sound

## License

MIT
