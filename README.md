#  Anonymous Feedback Web App

This is a full-stack web application built with **Next.js 15**, **TypeScript**, **MongoDB**, and **NextAuth**, allowing users to send and receive anonymous feedback. User identities are hidden, and feedback can be shared without revealing credentials.

##  Features

-  Secure signup and login using email verification
-  Users can receive anonymous messages
-  Sender remains completely anonymous
-  Feedback is stored and sorted by timestamp
-  Users can disable feedback reception
-  Real-time username uniqueness check
-  Deployed on Vercel with custom subdomain support

##  Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript
- **Backend**: Next.js API Routes, Mongoose, MongoDB Atlas
- **Auth**: NextAuth with email verification
- **Database**: MongoDB (cloud hosted)
- **Deployment**: Vercel

##  Installation

```bash
git clone https://github.com/prince-1104/anonymous-feedback.git
cd anonymous-feedback
npm install
