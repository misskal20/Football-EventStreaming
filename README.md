# Football-EventStreaming

# Football Match Tracker

Real-time football match tracker using **Event Streams (SSE)**.  
Admins can create matches and update scores; users can view live updates.

---

## Features

- **Admin:** Create matches, update scores (Admin panel visible only for admin role).  
- **User:** View live match list and details, scores update in real-time.  

---

## Tech Stack

- Frontend: React, Vite, JSX, CSS  
- Backend: Node.js, Express, SSE  

---

## Setup

1. **Clone the repo**  
```bash
git clone https://github.com/YOUR_USERNAME/football-match-tracker.git
cd EventStreaming
Backend

bash
Copy code
cd backend
npm install
npm start
Frontend

bash
Copy code
cd ../frontend/react-app
npm install
npm run dev
Environment Variables
Frontend .env (only one at a time):

*Admin:

ini
Copy code
VITE_ROLE=admin
VITE_SERVER_URL=http://localhost:5000

*User:

ini
Copy code
VITE_ROLE=user
VITE_SERVER_URL=http://localhost:5000
Restart Vite after changing .env.

*Backend .env:

ini
Copy code
PORT=5000
Usage
Admin can create/update matches; users see live updates.

Matches are streamed via SSE for real-time scores.
