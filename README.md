# 🌍 Wanderlust – A Travel Stay Booking Platform

Wanderlust is a full-stack MERN project inspired by Airbnb, allowing users to explore destinations, create listings, book stays, manage accounts, and much more.
Built with Node.js, Express, MongoDB Atlas, EJS, and Bootstrap, this project focuses on clean architecture and scalability.

## 🚀 Features
🔐 Authentication & Authorization

Secure user signup & login

Password hashing using bcrypt

Persistent sessions stored in MongoDB Atlas using connect-mongo

🏡 Listings

Create, update, delete listings

Upload images using Cloudinary

Responsive UI built with EJS + Bootstrap

⭐ Reviews

Users can post, edit, and delete reviews

Validation to prevent spam or empty reviews

👤 User Dashboard

Manage your listings

View your reviews

Update account info

🌐 Deployment Ready

Environment variables handled securely

Works with both local MongoDB + MongoDB Atlas

Fully compatible with Render / Railway deployment

## 📦 Tech Stack
| Category      | Technologies            |
| ------------- | ----------------------- |
| Backend       | Node.js, Express.js     |
| Database      | MongoDB Atlas           |
| Templating    | EJS                     |
| Styling       | Bootstrap, Custom CSS   |
| Image Upload  | Cloudinary              |
| Session Store | connect-mongo           |
| Auth          | bcrypt, express-session |
| Deployment    | Render                  |

## 📁 Project Structure
Wanderlust/                                                                            
├── public/                                                          
│   ├── css/                                                          
│   └── js/                                                          
├── routes/                                                          
│   ├── listing.js                                                          
│   ├── review.js                                                          
│   └── user.js                                                          
├── models/                                                          
│   ├── listing.js                                                          
│   ├── review.js                                                          
│   └── user.js                                                          
├── views/                                                          
│   ├── listings/                                                          
│   ├── reviews/                                                          
│   ├── users/                                                          
│   └── partials/                                                          
├── app.js                                                          
├── package.json                                                          
└── .env                                                          



## ⚙️ Environment Variables

Create a .env file:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
MONGO_ATLAS_URL=your_atlas_url
SESSION_SECRET=your_secret


## 🛠️ Installation
1️⃣ Clone the repository
git clone https://github.com/your-username/Wanderlust.git
cd Wanderlust

2️⃣ Install dependencies
npm install

3️⃣ Add your .env file

(See environment variable section above.)

4️⃣ Start the server
node app.js


Server will run on:
👉 http://localhost:8080


📝 License

This project is open-source and available under the MIT License.

⭐ Show Some Love

If this project helped you or inspired you, consider giving it a ⭐ star on GitHub!
