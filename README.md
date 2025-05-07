#Store Notify
> [Ecommerce Website](https://storenotify.in) built with MERN stack & Redux
---
## Features
* User Panel 
  * Authorization using JWT token
  * Reset Password and Forget Password
  * Advacnced filtering (filter using price,brands, ratings etc)
  * Checkout Process (shipping,payment method)
  * Payment Integration using Razorpay API
  * Review and Rating option
  * Fully Featured Cart options
  * Email notification after order placement and after succesfull delivery
* Admin Panel
  * CRUD operations on products
  * Auto Increment and decrement on products
  * User Management Panel
  * Mark order as delivered option
  * Database seeding script(products & Users)
## Technologies Used
* Frontend
  * React (UI)
  * React-bootstrap (CSS framerwork for styling)
  * Redux (State Management)
  * axios (For making requests to backend)
* Backend
  * Nodejs (Javascript runtime)
  * Expressjs (Nodejs framework)
  * MongoDB (Database)
  * Mongoose (ODM)
  * Json Web Token (Authorization purpose)
  * Bcryptjs (For password hashing)
  * GoogleAPIs (For sending mails via gmail)
  * Nodemailer (Mail sender)
  * Razorpay (For Handling Payments)
  * Multer (For file uploads)
 ## ENV Variables
 ### Create a .env file in root folder then add the following
 ```
 NODE_ENV = development
 PORT = 5000
 MONGO_URI = *yours mongodb URL*
 JWT_SECRET = *your JWT secret*
 RAZORPAY_CLIENT_ID = *client id*
 RAZORPAY_CLIENT_SECRET = *client secret*
 GOOGLE_CLIENT_ID = *your Google client_id*
GOOGLE_CLIENT_SECRET = *Google Client secret*
GOOGLE_REDIRECT_URI = *Redirect URI*
GOOGLE_REFRESH_TOKEN= *Refresh token*
URL = *localhost address while on development | live address while on production*
 ```
 ## Installing dependencies and running the Project
 ```
 npm install
 cd client
 npm install
 # Comeback in root folder of project
 *Following command runs frontend on PORT 3000 and backend on PORT 5000*
 npm run dev
 *Following command runs frontend on PORT 3000*
 npm run client
 *Following command runs backend on PORT 5000*
 npm run server
 ```
