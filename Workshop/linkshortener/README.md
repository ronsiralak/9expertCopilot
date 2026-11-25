This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Authentication uses Clerk. Link this project to your existing Clerk application
and pull its development environment variables with the Clerk CLI before
starting the app. The dashboard requires sign-in; other routes are public by
default and must be protected explicitly when authentication is required.

Neon Postgres is available to server-side code through the Drizzle `db` export
in `db/index.ts`. Run `neon env pull` after linking the project to configure
`DATABASE_URL` locally. No database tables are created by this setup.

Drizzle Kit reads `DATABASE_URL` from `.env`; configure it with the direct Neon
connection for migrations. The schema is in `db/schema.ts`. Test schema
changes on a Neon branch before applying them to production. `updated_at` is
updated automatically by Drizzle on updates that do not explicitly set it;
other database clients must set it themselves.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
