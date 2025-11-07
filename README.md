# REECH: Nurture - App Prototype

This is a Next.js application built with Firebase Studio.

## How to Deploy This Application to Vercel

Vercel is a platform for hosting web applications that is highly optimized for Next.js. Follow these steps to get your site live in minutes.

### Step 1: Push Your Code to a Git Provider

Vercel deploys directly from a Git repository. If you haven't already, you need to push your project to a provider like GitHub, GitLab, or Bitbucket.

1.  **Create a GitHub Repository**: Go to [GitHub](https://github.com) and create a new repository. Don't initialize it with a README or .gitignore, as you already have those files.
2.  **Link and Push Your Project**: Follow the instructions on GitHub to push your existing local project to the newly created repository.

### Step 2: Sign Up for Vercel

1.  Go to the [Vercel website](https://vercel.com/signup).
2.  The easiest way to sign up is by using your **GitHub account**. This automatically connects Vercel to your repositories.

### Step 3: Import Your Project in Vercel

1.  Once you are signed in, you will be taken to your Vercel dashboard.
2.  Click the **"Add New..."** button and select **"Project"**.
3.  The "Import Git Repository" screen will appear. Find the GitHub repository you just created/pushed and click the **"Import"** button next to it.
4.  If you don't see it, you may need to grant Vercel access to that specific repository through the GitHub integration settings.

### Step 4: Configure Your Project

Vercel is smart and will automatically detect that you are deploying a Next.js application. The default settings are usually perfect.

The most important step here is to add your **Environment Variables**. Your app's AI features will not work without them.

1.  In the configuration screen, find and expand the **"Environment Variables"** section.
2.  You need to add one variable:
    *   **Name**: `GEMINI_API_KEY`
    *   **Value**: Paste your actual Gemini API key here. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Click the **"Add"** button to save the variable.

### Step 5: Deploy!

1.  After adding the environment variable, simply click the **"Deploy"** button.
2.  Vercel will now start building and deploying your application. You can watch the progress in the build logs.
3.  Once it's finished (it usually takes a few minutes), you'll see a "Congratulations!" message with a preview of your live site.

That's it! Your REECH application is now live on the internet. Vercel will automatically redeploy your application every time you push new changes to your GitHub repository.
