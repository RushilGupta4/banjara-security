# Banjaara Event Management System

## Overview

Banjaara Event Management System is a comprehensive web application designed to manage registrations, check-ins, and competitions for Ashoka University's cultural fest, Banjaara. This system provides an efficient way to handle on-spot registrations, user check-ins, and competition participation tracking.

## Features

- **User Registration**: Allows on-spot registration for event participants.
- **Check-In System**: Manages user check-ins and check-outs at the event.
- **Competition Management**: Tracks user participation in various competitions.
- **Admin Dashboard**: Provides an overview of registrations, check-ins, and competition data.
- **User Replacement**: Allows administrators to replace registered users if needed.
- **Email Notifications**: Sends confirmation emails to registered users.

## Technology Stack

- **Frontend**: Next.js with TypeScript
- **UI Framework**: NextUI
- **Backend**: Firebase (Firestore for database, Authentication for admin login)
- **Email Service**: Nodemailer

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase configuration in `src/firebase/config.ts`
4. Set up environment variables for email service
5. Run the development server: `npm run dev`

## License

[MIT License](LICENSE)
