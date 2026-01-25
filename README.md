# Immigration Chatbot

## 📌 Project Overview

**Immigration Chatbot** is an AI-powered assessment chatbot designed to evaluate immigration eligibility for **British Columbia** and **Nova Scotia** programs. The chatbot dynamically asks users program-specific questions and calculates scores based on their responses. A detailed assessment summary is generated, which users can view, download as a report, and share via email.

Admins can manage and update the chatbot's question flow directly through an admin dashboard, making the system flexible and easily adaptable to policy or criteria changes.

🔗 **Live Demo:** [https://assessment-orcin-nine.vercel.app/](https://assessment-orcin-nine.vercel.app/)

---

## 🚀 Key Features

* 🤖 Interactive AI-based chatbot for immigration assessment
* 🇨🇦 Supports **British Columbia** and **Nova Scotia** programs
* 📊 Automatic score calculation based on user answers
* 📄 Generate detailed assessment summary & report
* ⬇️ Download report as a PDF
* 📧 Email report directly to the user
* 🛠️ Admin dashboard to modify chatbot questions dynamically
* ☁️ Fully deployed on Vercel

---

## 🧰 Tech Stack

* **Language:** JavaScript / TypeScript
* **Frontend & Backend:** Next.js
* **AI Integration:** Vercel AI SDK
* **Database:** PostgreSQL
* **Hosting:** Vercel

---

## 🏗️ Project Use Case

This project can be used as an **immigration assessment tool** to help applicants:

* Understand their eligibility
* Get instant feedback and scoring
* Receive a professional summary report

It is suitable for:

* Immigration consultants
* Assessment platforms
* Educational or demo purposes

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd immigration-chatbot
```

### 2️⃣ Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file and configure the following variables:

```env
DATABASE_URL=
EMAIL_USER=
EMAIL_PASS=
```

### 4️⃣ Run the Project Locally

```bash
pnpm dev
# or
npm run dev
```

The app will run at `http://localhost:3000`

---

## 📊 Admin Dashboard

* Modify and manage chatbot questions
* Update program-specific flows
* Control scoring logic dynamically

---

## 📈 Future Improvements

* Add more Canadian immigration programs
* Improve AI-based answer validation
* Add user authentication
* Export reports in multiple formats

---

## 👨‍💻 Author

**Arnav Panchal**

If you like this project, feel free to ⭐ the repository and share feedback!
