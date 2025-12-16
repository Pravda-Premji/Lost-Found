# 🧳 Lost & Found Portal

A web-based Lost & Found application that helps users post lost or found items, upload images, and automatically detect similar items using smart matching logic.

🔗 **Live Demo:**  
https://lostfound1-f2cd5.web.app

---

## 📌 Problem Statement

In colleges and public places, lost items are usually reported through WhatsApp groups or notice boards, which:
- Are unorganized
- Do not support searching
- Make it difficult to find matching lost/found items

This project provides a **centralized, searchable, and secure platform** to solve this problem.

---

## 🚀 Features

- 🔐 Google Authentication (Login required to post)
- 📝 Post Lost or Found items
- 🖼️ Image upload support
- 🤖 Smart matching between Lost & Found items
- 📂 “My Posts” page (view your own posts)
- 🗑️ Users can delete only their own posts
- 🔍 Search and filter by type and location
- ☁️ Fully deployed using Firebase Hosting

---

## 🧠 Smart Matching Logic

When a new item is posted:
- Keywords are extracted from title & description
- Location similarity is checked
- Lost items are matched only with Found items (and vice versa)
- A minimum match score is required to avoid false matches

This prevents incorrect matches based only on location.

---

## 🛠️ Tech Stack & Tools Used

### Frontend
- **HTML** – Structure of the application
- **CSS** – Styling and responsive UI
- **JavaScript** – Application logic

### Backend & Services
- **Firebase Authentication**
  - Used for Google login
  - Ensures only authenticated users can post items

- **Firebase Firestore**
  - Stores lost & found item details
  - Secured using Firestore security rules
  - Each post is linked to the user’s UID

- **Cloudinary**
  - Used to upload and store images
  - Unsigned upload preset for frontend usage

- **Firebase Hosting**
  - Used to deploy the application
  - Provides a live URL for public access

---

## 🔐 Security Considerations

- Firebase API keys are public by design and safe to expose
- Security is enforced using:
  - Firebase Authentication
  - Firestore Security Rules
- Users can only edit or delete their own posts
- API key usage is restricted to required services

---

## 📁 Project Structure
lostfound/
│
├── index.html # Home page (list items)
├── post.html # Post lost/found item
├── myposts.html # User’s own posts
├── css/
│ └── styles.css
├── js/
│ ├── firebaseConfig.js
│ ├── auth.js
│ ├── main.js
│ ├── post.js
│ └── myposts.js
└── README.md
🎯 Future Improvements

#Admin moderation panel
#Email notifications for matches
#Advanced AI-based image matching
#Chat between finder and owner
