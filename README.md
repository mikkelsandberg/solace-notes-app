# Solace Notes App
Notes web app for the Solace technical assignment.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Notes

- The live version of this app can be found at: https://solace-notes-app-smoky.vercel.app/
- The authentication backend is from Vercel: https://vercel.com/templates/next.js/prisma-postgres-auth-starter
- The UI for the login screen is from MUI: https://github.com/mui/material-ui/tree/v5.15.17/docs/data/material/getting-started/templates/sign-in
- The UI for the notes is based on MUI as well: https://github.com/mui/material-ui/tree/v5.15.17/docs/data/material/getting-started/templates/dashboard
- The biggest challenge was setting up the authentication flow with next-auth and getting everything deployed on Vercel, as these systems were new to me.

## Local Development

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
