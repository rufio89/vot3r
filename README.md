# Movie Night Voting App

## Description
Movie Night Voting App is a web application that allows users to create and manage movie nights, add movies to their personal lists, and vote on movies for group viewing sessions. It's perfect for friends, families, or any group looking to democratically decide on their next movie night selection.

## Features
- User authentication
- Create and manage movie nights
- Search and add movies to personal lists
- Vote on movies for specific movie nights
- Real-time vote tracking
- Countdown timer to movie night events
- Invite friends to movie nights
- Responsive design for mobile and desktop use

## Technologies Used
- Next.js
- React
- TypeScript
- Firebase (Authentication, Firestore)
- Tailwind CSS
- OMDB API for movie data

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Firebase account
- OMDB API key

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/movie-night-voting-app.git
   cd movie-night-voting-app
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage
1. Sign up or log in to your account
2. Create a new movie night or join an existing one
3. Search for movies and add them to your list
4. Vote on movies for upcoming movie nights
5. Invite friends to join your movie night
6. Watch the countdown and prepare for your movie night!

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgements
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OMDB API](http://www.omdbapi.com/)
