# MarketShare - A Modern Marketplace Platform

This is a feature-rich marketplace application built with a modern tech stack. It allows users to buy, sell, and rent products in a community-focused environment. The project leverages Firebase for authentication and Supabase for database and file storage, with AI-powered features to enhance the user experience.

## Live Demo

[Provide a link to your Vercel deployment here]

## Features

### User & Authentication
- **Firebase Authentication**: Secure user sign-up and login.
- **Social Login**: Sign in with Google for a seamless experience.
- **Email/Password Login**: Traditional email and password authentication.
- **User Profiles**: Users have a dedicated profile page where they can update their name.

### Marketplace & Listings
- **Create Listings**: Users can easily create new listings for items they want to sell or rent.
- **AI-Generated Content**: When creating a listing, users can leverage AI to automatically generate compelling titles and descriptions based on a product photo and category.
- **Image Uploads**: Product photos are uploaded to Supabase Storage.
- **Comprehensive Marketplace**: A central home page displays all available listings.
- **Advanced Filtering & Search**: Users can search for items by keyword and filter by category, condition (new/used), and price range.
- **Detailed Product View**: Each listing has its own page with detailed information, seller details, and user reviews.

### Listing Management
- **My Listings**: A dedicated tab on the user's profile page shows all the items they have listed.
- **Edit & Delete**: Users have full control to edit or delete their own listings directly from the product page or their profile.

### Buying & Renting
- **Request System**: Buyers can send a formal request to a seller to either purchase or rent an item.
- **Request Management**: Both buyers and sellers can track the status (pending, accepted, rejected) of their requests in a "Requests" tab on their profile page.
- **Seller Actions**: Sellers can accept or reject incoming requests.

### Reviews & Community
- **Product Reviews**: Users can write reviews and provide star ratings for products.
- **Seller Information**: Each product page displays information about the seller, fostering a sense of community.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **File Storage**: [Supabase Storage](https://supabase.com/docs/guides/storage)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Vercel](https://vercel.com/)
