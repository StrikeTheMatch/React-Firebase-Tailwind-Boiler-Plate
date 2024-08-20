# Firebase React Application

This project is a React application integrated with Firebase, set up to run on Replit.

## Setup and Running

### On Replit

1. Clone this repository in Replit.
2. The project is pre-configured to use Replit's environment secrets for Firebase configuration. No additional setup for Firebase secrets is required.
3. In the Replit shell, run:
   ```
   npm install
   ```
4. Once the installation is complete, click the "Run" button in Replit to start the development server.

### Running Locally (Outside Replit)

If you want to run this project locally on your machine:

1. Clone this repository to your local machine.
2. Navigate to the project directory and run:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory of the project.
4. Add your Firebase configuration to the `.env` file. Use this format:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```
5. Replace the placeholder values with your actual Firebase configuration.
6. Run the development server with:
   ```
   npm run dev
   ```

## Note on Environment Variables

This project uses Vite, which prefixes environment variables with `VITE_`. Ensure your environment variable names match those used in the application code.

## Firebase Configuration

The Firebase configuration in this project is set up to use Vite's environment variable system. In Replit, these are automatically handled through Replit's environment secrets. For local development, you'll need to provide these in a `.env` file as described above.

Remember: Never commit your `.env` file or share it publicly, as it contains sensitive information.****