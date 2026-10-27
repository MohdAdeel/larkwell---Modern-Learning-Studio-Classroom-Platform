# Larkwell

Larkwell is a premium online teaching and learning studio. Students join live classes, follow courses, and work from shared study materials. Teachers schedule sessions, build curricula, and teach on an interactive whiteboard. Administrators oversee the platform from a separate workspace.

This repository is the frontend only. It runs in the browser with local sample data, so you can walk through the product without a backend, database, authentication server, or real video calls.

## What you can explore

- Public pages for the landing story, course catalog, teacher profiles, pricing, and help.
- Separate student, teacher, and administrator workspaces, with a demo role switcher.
- Course, class, assignment, subscription, and notification flows backed by mock records.
- A live classroom layout with simulated controls for a demo session.
- Whiteboards with drawing tools, stable board IDs, and shareable detail routes.
- A study materials library with folders, previews, and local organization.

Sign-in, checkout, uploads, and class controls are simulated. Changes stay in the browser and fall back to the original sample data.

## Screenshots

## Restart

Stop the running development server with `Ctrl+C`, then start it again:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If the app does not pick up recent changes, clear the Next.js cache and start once more:

```bash
rm -rf .next
npm run dev
```
