# Link in Bio App

A modern, customizable link-in-bio solution built with Next.js and TailwindCSS.

## Features

- 🎨 Modern UI with dark mode support
- 🔒 GitHub authentication
- 📱 Fully responsive design
- 🖼️ Image upload with cropping
- ⚡ Fast and SEO optimized
- 🔗 Customizable social links
- 💾 Local storage persistence

## Deploy on Vercel

Deploy your own copy of this app using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Flink-in-the-bio-app)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/link-in-the-bio-app.git
   cd link-in-the-bio-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a GitHub OAuth app:
   - Go to GitHub Settings > Developer Settings > OAuth Apps > New OAuth App
   - Set Homepage URL to `http://localhost:3000` (for development)
   - Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
   - After creating, copy the Client ID and generate a Client Secret

4. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the values:
     ```bash
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=$(openssl rand -base64 32)
     GITHUB_ID=your-github-oauth-client-id
     GITHUB_SECRET=your-github-oauth-client-secret
     ALLOWED_EMAIL=your-email@example.com
     ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment Steps

1. Push your code to GitHub

2. Import your repository in Vercel:
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
     - `NEXTAUTH_SECRET`: Generate a random string
     - `GITHUB_ID`: Your GitHub OAuth Client ID
     - `GITHUB_SECRET`: Your GitHub OAuth Client Secret
     - `ALLOWED_EMAIL`: Your email for admin access

3. Deploy!
   - Vercel will automatically build and deploy your app
   - Update your GitHub OAuth app with the production URLs

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License - feel free to use this project for your own link-in-bio page!
