This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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

## Supabase Image Storage

Canvas images are saved locally in IndexedDB as soon as they are imported. When
an authenticated project is saved, images up to 5 MB are uploaded to Supabase
Storage in the background. Larger images remain local-only and are not rejected
by the editor.

Configure these server environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_STORAGE_BUCKET=uploads
```

Create the storage bucket before saving projects and make it public so persisted
image URLs can be rendered directly. `SUPABASE_STORAGE_BUCKET` is optional and
defaults to `uploads`. The older `SUPABASE_URL` and `SUPABASE_ANON_KEY`
environment names are also supported. Public buckets still require appropriate
`storage.objects` policies for upload and delete operations when using a
publishable or anon key.

The reusable storage service can be used from authenticated server code:

```ts
import { storageService } from "@/services/storage.service"

const result = await storageService.upload({
  bucket: "uploads",
  folder: "avatars",
  file,
})

console.log(result.publicUrl)
```

The service generates a unique filename, uploads with the original MIME type,
and obtains the public URL through Supabase's `getPublicUrl()` API.

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
