# AssetVerse (Server)

## Purpose
Backend API for the AssetVerse Corporate Asset Management System.  
Handles authentication, authorization, asset management, requests, assignments, package upgrades, payments, analytics, notices, and employee affiliation logic.

---

## Live API URL
https://assetverse-server.onrender.com

---

## Key Features
### Authentication & Security
- Firebase Authentication verification
- JWT-based login (email/password)
- Protected routes using middleware
- Role-based access (HR / Employee)

### HR Manager Features
- Add assets  
- View & delete assets  
- Approve / Reject asset requests  
- Auto employee affiliation  
- Employee list with asset count  
- Remove employee (auto-return system)  
- Stripe payment to upgrade package  
- Store payment history  
- Publish company notices  
- Analytics (top assets, asset type distribution)

### Employee Features
- Request assets from any company  
- View assigned assets  
- Return returnable items  
- View team members per company  
- View company notices  

---

## Technologies Used
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Firebase Admin SDK  
- JWT  
- Stripe  
- CORS  
- dotenv  

---

## Setup Instructions
```bash
git clone https://github.com/Avishek02/assetverse-server.git
cd assetverse-server
npm install
npm run dev
```

---

## Environment Variables
Create a `.env` file in the server root:

```
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_ORIGIN_LOCAL=http://localhost:5173
CLIENT_ORIGIN_PROD=https://assetverse-client.vercel.app

STRIPE_SECRET_KEY=your_stripe_key
```

---

## Folder Structure
```
server/
  config/
  controllers/
  middlewares/
  models/
  routes/
  index.js
```

---

## Main API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### HR Asset Management
- GET `/api/assets/hr`
- POST `/api/assets`
- DELETE `/api/assets/:id`

### Employee Requests
- POST `/api/requests`
- GET `/api/requests/hr`
- PATCH `/api/requests/:id/approve`
- PATCH `/api/requests/:id/reject`

### Assigned Assets
- GET `/api/assigned-assets`
- PATCH `/api/assigned-assets/:id/return`

### Employees
- GET `/api/employees/hr`
- DELETE `/api/employees/hr/:employeeEmail`

### Payments / Packages
- GET `/api/packages`
- POST `/api/payments/create-checkout-session`
- POST `/api/payments/confirm`

### Notices
- POST `/api/notices`
- GET `/api/notices/employee`

### Analytics
- GET `/api/analytics/asset-types`
- GET `/api/analytics/top-requested-assets`

---

## Test Credentials
```
HR Email: hr@testcompany.com
HR Password: hrtest1234
```

---

## Deployment Notes
- Hosted on Render  
- Add all `.env` variables in Render dashboard  
- Enable CORS for client URL  
- Always use `NODE_VERSION 18+`  

---


