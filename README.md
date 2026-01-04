# Job Application Tracker

A full-stack web application for tracking job applications, monitoring progress, and viewing application statistics.

## Screenshots

### Dashboard with Job Applications
View all your tracked job applications with status, company, and date information. Filter by status and manage applications in one place.
![Dashboard](screenshots/dashboard.png)

### Statistics & Conversion Metrics
Real-time analytics showing total applications, status breakdown, and conversion rates for interviews, offers, and acceptances.
![Job Statistics](screenshots/job-stats.png)


## Features

- Track job applications with company, role, and status
- View real-time statistics including conversion rates
- Edit and delete applications with inline editing
- Track application status through the pipeline: Applied → Interview → Offer → Accepted/Rejected
- Professional dashboard with statistics and progress visualization
- JWT-based authentication with encrypted passwords
- MongoDB for data storage
- Responsive design for mobile and desktop

## Tech Stack

### Backend
- FastAPI - Python web framework
- MongoDB - NoSQL database
- JWT - Token-based authentication
- bcrypt - Password hashing

### Frontend
- React 18 - UI framework
- Plain CSS - Modern styling
- Vite - Build tool
- React Router - Client-side routing

## Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- MongoDB Atlas account
- Text editor or IDE

## Installation

### Backend Setup

```bash
cd Backend
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the Backend directory:
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/jobtracker?tlsAllowInvalidCertificates=true
```

Start the backend server:
```bash
python -m uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and receive JWT token

### Jobs (Requires bearer token)
- `GET /jobs/` - Get all user's applications
- `POST /jobs/` - Create new application
- `PUT /jobs/{job_id}` - Update application
- `DELETE /jobs/{job_id}` - Delete application
- `GET /jobs/stats` - Get statistics

## Usage

1. Sign up with email and password
2. Log in to access the dashboard
3. Add new job applications with company, role, status, and notes
4. View statistics showing conversion rates
5. Edit application details inline
6. Delete applications as needed
7. Filter applications by status

## Dashboard Statistics

The dashboard displays:
- Total applications
- Applications by status (Applied, Interview, Offer, Accepted, Rejected)
- Interview conversion rate
- Offer rate
- Acceptance rate

## Project Structure

```
Job Application Tracker/
├── Backend/
│   ├── app/
│   │   ├── main.py              # FastAPI setup
│   │   ├── database.py          # MongoDB connection
│   │   └── routes/
│   │       ├── auth.py          # Authentication
│   │       ├── jobs.py          # Job operations
│   │       └── deps.py          # JWT validation
│   ├── requirements.txt         # Python packages
│   └── .env                     # Configuration
│
└── Frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx       # Home page
    │   │   ├── Login.jsx         # Login
    │   │   ├── Signup.jsx        # Registration
    │   │   └── Dashboard.jsx     # Main application
    │   ├── components/
    │   │   ├── JobForm.jsx       # Add job form
    │   │   ├── JobCard.jsx       # Job display
    │   │   └── JobStats.jsx      # Statistics
    │   ├── services/
    │   │   └── api.js            # API client
    │   └── App.jsx               # Main component
    ├── index.html                # HTML entry point
    ├── package.json              # Dependencies
    └── Config files              # Vite, Tailwind, PostCSS
```

## Security

- Passwords are hashed with bcrypt
- JWT tokens expire after 60 minutes
- Bearer tokens required for protected endpoints
- User data isolation - each user only sees their own applications
- Input validation on all requests
- CORS configured for frontend access

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB Atlas IP whitelist includes your address
- Check credentials in `.env` file
- SSL certificate verification is disabled in the connection string

### CORS Errors
- Backend has CORS middleware configured
- Ensure frontend API calls use `http://localhost:8000`

### Token Expiration
- Tokens expire after 60 minutes
- Users are redirected to login when token expires
- Login again to get a new token

## Configuration

The application can be configured via environment variables and config files:
- `Backend/.env` - MongoDB connection URL
- `Frontend/src/services/api.js` - API base URL
- `Frontend/src/styles.css` - Custom CSS styling
- `vite.config.js` - Vite build configuration

## Deployment

### Backend
Deploy to Heroku, Railway, or Render by setting the MONGO_URL environment variable and pushing the repository.

### Frontend
Build with `npm run build` and deploy the `dist/` folder to Vercel, Netlify, or any static hosting service.

## Development

The application uses:
- Async/await for backend operations
- MongoDB aggregation pipelines for statistics
- React hooks for state management
- Custom CSS with modern styling
- Vite for fast development builds

