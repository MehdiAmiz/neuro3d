# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/26746387-0cc9-464e-9f22-0d4b6ed75e34

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/26746387-0cc9-464e-9f22-0d4b6ed75e34) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Framer Motion
- React Router DOM

## Features

### User Profile Page
- **Location**: `/profile`
- **Access**: Available to authenticated users
- **Features**:
  - **Dashboard Layout**: Modern tabbed interface with sidebar navigation
  - **Profile Management**: View and edit personal information (name, email)
  - **Security Settings**: Change password with validation and show/hide functionality
  - **Credits System**: Display current credit balance and purchase additional credits
  - **Activity Tracking**: View recent account activity and history
  - **Account Statistics**: Account age, status, and member information
  - **Responsive Design**: Glassmorphism effects with cyberpunk aesthetic
  - **Smooth Animations**: Framer Motion powered transitions
  - **Consistent Styling**: Matches home page and app page design language
  - **Header & Footer**: Same navigation and footer as other pages
  - **Database Integration**: All changes are saved to the database and persist
- **Password Management**: Secure password change with current password verification
- **Checkout System**: PayPal and credit card payment integration for purchasing credits

### Checkout Page
- **Location**: `/checkout`
- **Access**: Available to authenticated users
- **Features**:
  - **Credit Packages**: Three-tier pricing (Starter, Pro, Premium) with discounts
  - **Payment Methods**: PayPal and credit card (Visa, Mastercard, American Express) support
  - **Secure Processing**: Encrypted payment information handling
  - **Real-time Validation**: Credit card number formatting and validation
  - **Order Summary**: Clear breakdown of package details and pricing
  - **User Testimonials**: Social proof with customer reviews
  - **Responsive Design**: Mobile-friendly checkout experience
  - **Consistent Styling**: Matches app design language with glassmorphism effects

### Authentication
- User registration and login
- Session management with localStorage
- Protected routes for authenticated users
- User context management

### Main Application
- 3D model conversion and rendering
- Modern UI with cyberpunk aesthetic
- Responsive design
- Interactive components

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/26746387-0cc9-464e-9f22-0d4b6ed75e34) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
