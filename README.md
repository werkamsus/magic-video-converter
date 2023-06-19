## Magic video converter 🦎

### My initial notes

I’d like to convert videos to different formats from time to time. Would be amazing to just have an App I could select & then tell GPT what I want to do.

“rotate my video 90 degrees clockwise”

“convert my video to mp3”

→ save all requests and cache them, add them to an auto-complete. Then, the next user can type / select the question, or generate a new one with GPT. Each request gives the prompt an “upvote” so it’s higher surfaced. Top 5 get shown as buttons.

Uses openAI functions, in-browser FFMPEG.

Somehow, I’m really keen on building this. Just for fun 🙂

### lessgo 3pm 🦎

what do I need?

1. make web wasm conversion work
2. AI commands
3. pretty UI
4. done

---
### Ideal flow:
Full-screen empty state "1. select your file, 2. tell us how you'd like to modify it, 3. save file"


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
