# meru-donation-funding

## Paystack setup

This is a Vite frontend, so the browser-visible Paystack key must use the `VITE_` prefix.

1. Copy `.env.example` to `.env` for local development.
2. Set `VITE_PAYSTACK_PUBLIC_KEY` to the Paystack **public** key for the account and environment you want to use.
3. In Vercel, add `VITE_PAYSTACK_PUBLIC_KEY` under Project Settings > Environment Variables for the environments you deploy, then redeploy.

Never add a Paystack secret key to this frontend or to a `VITE_` variable. A secret key requires a server-side API route, which this project does not currently have.

Donations accept whole KES amounts greater than 5, so the minimum is KES 6. The Paystack inline script is loaded from Paystack in `index.html`.
