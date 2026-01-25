Title: PayGo Frontend
Subtitle: Modern Fintech Web App
Colors: Blue gradient (#1D4ED8 → #3B82F6)
Icons: 💳, 🏦, 🚀

Content:

Built with React, Tailwind CSS, Axios

Fully integrated with PayGo backend

Secure user authentication & wallet management

🛠 Tech Stack Card

Title: Tech Stack
Colors: White background, blue accent headers
Icons: ⚡, 💻

Feature	Technology
Framework	React
Routing	React Router v6
Forms & Validation	react-hook-form + Yup
API Requests	Axios
Notifications	React Toastify
Styling	Tailwind CSS
State Management	React Context API
Icons	react-icons
Env Variables	Vite
📁 Project Structure Card

Title: Project Structure
Colors: Light gray background (#F3F4F6)
Icons: 📂, 🗂

src/
├── pages/
│   ├── auth/        → Login, Register, VerifyOtp
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── FundWallet.jsx
│   ├── SetPin.jsx
│   ├── TransferFunds.jsx
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   ├── Transactions.jsx
│   ├── TransactionDetails.jsx
│   ├── More.jsx
│   └── VerifyFundingPage.jsx
├── components/      → BackButton.jsx
├── context/         → UserContext.jsx
├── services/        → api.js
├── App.jsx
└── main.jsx

⚡ Features Card

Title: Features
Colors: White background, green accent (#16A34A)
Icons: ✅, 💰, 🔒

Authentication

Register/Login with email & password

OTP-based Forgot Password & Reset Password

User session management via React Context

Wallet Management

View wallet balance (hide/show toggle)

Fund Wallet & Transfer Funds

Set wallet PIN

Transactions

View all transactions

Detailed view per transaction

Profile & More

User profile page

More section for future enhancements

⚙ Setup & Installation Card

Title: Installation & Setup
Colors: Light gray background (#F3F4F6)
Icons: ⚙, 🏗

Steps:

Clone repo: git clone https://github.com/Lecksikerm/paygo-frontend.git

Install dependencies: npm install

Add .env:

VITE_API_BASE_URL=https://paygo-backend-9srx.onrender.com/api


Run dev server: npm run dev → http://localhost:5173/

Build for production: npm run build

Deploy: Netlify / Vercel / Render

🧩 Key Components Card

Title: Key Components
Colors: White background, yellow accent (#FBBF24)
Icons: 🧩

App.jsx → Central router

UserContext.jsx → Global user state

services/api.js → Axios with JWT interceptor

Auth Pages → Login, Register, Forgot/Reset Password

Dashboard.jsx → Wallet overview & actions

🌟 Future Enhancements Card

Title: Future Enhancements
Colors: Light blue background (#E0F2FE)
Icons: 🌟

Profile update (avatar, phone, address)

Transaction search/filter

Push notifications for transactions

Dark mode toggle

Admin dashboard

📞 Support Card

Title: Support & Contact
Colors: White background, red accent (#EF4444)
Icons: 📞

Email: idrisolalekann.com

GitHub: https://github.com/Lecksikerm/paygo-frontend
