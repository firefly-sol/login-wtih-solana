# Log in with Solana

This app is an example of patterns you can use to use a solana wallet for authentication on your full stack app. You may want to do this for a variety of reasons, for instance your users not having to remember a username or password to use your app.
This can create a very convenient user experience for crypto native users who already have wallets installed to use your app.
This is the login method of choice for most NFT marketplaces.

## How does this work?

Essentially to use web3 in your app

1. Assign the user a nonce cookie.
2. Have the user sign a message using that nonce.
3. Send the message to the backend, compare it to what you expect given the public key / nonce cookie.
4. Sign a JWT token and assign a new cookie for the user.
5. Use this authentication cookie for any authentication services in your app.

## How to run this app?

First get a free database from supabase and use their JWT token and add them to you .env
Then you can use the following commands

```sh
npx prisma db push
pnpm install
pnpm run dev
```

## Tools used in this app.

I reccomend typesafety for any web3 app. For the tools I use in this tutorial, you can check these out!

- [Next-Auth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [supabase](https://supabase.com/)

You can check out [the t3 docs](https://create.t3.gg) with some summary information and links to the respective documentation.

## How do I deploy this?

To get a free database, you can visit supabase and create a new project.
Find the database URL and add it to your .env, and then push your schema using

```sh
npx prisma db push
```

Remember to deploy the database in the same reigon as your vercel depoyment.

