# REECH: Nurture - App Prototype

This is a Next.js application built with Firebase Studio. It serves as a prototype for **REECH**, a platform designed to help church and outreach teams manage evangelism, follow-up, and nurture new believers with love and consistency.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **AI Integration**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Key Features

- **Role-Based Access**: Separate views and permissions for 'Supervisors' and 'Reachers'.
- **Outreach Management**: Plan, create, and manage outreach events.
- **Contact & Convert Tracking**: Add and manage contacts and new converts from outreach events.
- **AI-Powered Assistance**:
    - Generate personalized follow-up messages.
    - Create encouraging messages with relevant scriptures.
- **Discipleship Feed**: A space for team members to share devotional posts.
- **Automated Follow-ups**: Schedule messages to be sent to contacts at a future date.

## Getting Started

To run this project locally, you will need to have Node.js and npm (or yarn/pnpm) installed on your machine.

### 1. Set Up Environment Variables

The application's AI features rely on the Gemini API. You will need to get an API key and make it available to the application.

1.  **Get a Gemini API Key**:
    - Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Sign in with your Google account.
    - Click **"Create API key in new project"** and copy the generated key.

2.  **Create an Environment File**:
    - In the root of the project, create a new file named `.env`.
    - Add the following line to the file, replacing `YOUR_API_KEY` with the key you just copied:
      ```
      GEMINI_API_KEY=YOUR_API_KEY
      ```

### 2. Install Dependencies

Open your terminal, navigate to the project directory, and run the following command to install the necessary packages:

```bash
npm install
```

### 3. Run the Development Server

Once the dependencies are installed, you can start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Deploy to Vercel

This project is optimized for deployment on Vercel.

1.  **Push to GitHub**: Make sure your project code is pushed to a GitHub repository.
2.  **Import to Vercel**: Sign up or log in to [Vercel](https://vercel.com/) with your GitHub account and import the repository.
3.  **Configure Environment Variables**: In the Vercel project settings, navigate to **Settings > Environment Variables** and add your `GEMINI_API_KEY` with the same name and value as you did in your `.env` file.
4.  **Deploy**: Vercel will automatically detect the Next.js framework and deploy your application. Any subsequent pushes to the `main` branch will trigger automatic redeployments.
