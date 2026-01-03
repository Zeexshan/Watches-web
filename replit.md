# Circle Luxury E-Commerce Application

## Overview

Circle Luxury is a high-end e-commerce web application for selling luxury watches, belts, sunglasses, and attar (perfume). The application features a "Partial COD" checkout system where Cash on Delivery orders require upfront payment of shipping charges via Razorpay before the order can be placed.

The project is built as a full-stack TypeScript application with React frontend and Express backend, using Google Sheets as the primary database for storing Users, Orders, and Products data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled using Vite
- **Styling**: Tailwind CSS with a luxury dark theme (Black Pearl, Woodsmoke, Stellar Explorer backgrounds with Spicy Sweetcorn gold accents)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for luxury-feel transitions and micro-interactions
- **State Management**: 
  - React Query (@tanstack/react-query) for server state and API caching
  - React Context for local state (AuthContext for authentication, CartContext for shopping cart)
- **Routing**: wouter for lightweight client-side routing
- **Typography**: Montserrat (body) and Playfair Display (headings) fonts

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **API Design**: RESTful endpoints under `/api/*` prefix
- **File Uploads**: multer for handling product image uploads
- **Build**: esbuild for production server bundling

### Data Storage
- **Primary Database**: Google Sheets via `google-spreadsheet` npm package
  - Users tab: Customer registration and authentication data
  - Orders tab: Order history and status tracking
  - Products tab: Product catalog with pricing, variants, and images
- **Schema Definition**: Drizzle ORM with PostgreSQL schema (available for future migration)
- **Session Storage**: localStorage for client-side auth persistence

### Authentication
- Custom implementation using Google Sheets Users tab
- Session persistence via localStorage on the client
- No server-side sessions currently implemented

### Key Features
- Product catalog with category filtering and price sorting
- Shopping cart with local storage persistence
- Multi-step checkout (shipping details → payment method selection)
- Partial COD system: shipping charges paid online, product cost on delivery
- Admin dashboard for order management and product uploads
- User account with order history

## External Dependencies

### Google Services
- **Google Sheets API**: Primary database connection via `google-spreadsheet` package
- **Authentication**: Service account with `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` environment variables
- **Sheet ID**: Configured via `GOOGLE_SHEET_ID` environment variable

### Payment Integration (Planned)
- **Razorpay**: For online payment processing (shipping charges for COD, full payment for prepaid)
- Endpoint structure: `/create-order` for payment initialization

### Shipping Integration (Planned)
- **Delhivery API**: For shipping cost calculation via `calculateShipping(pincode)` function

### Environment Variables Required
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Google service account email
- `GOOGLE_PRIVATE_KEY`: Google service account private key
- `GOOGLE_SHEET_ID`: ID of the Google Sheet containing data
- `DATABASE_URL`: PostgreSQL connection string (for Drizzle schema)

### Development Tools
- Replit-specific plugins for development (cartographer, dev-banner, runtime error overlay)
- drizzle-kit for database migrations