# Teltonika Posts System Task

This repository contains a posts management system developed as part of a Web Development Internship task.  
The goal of this project was to demonstrate clean code structure, modularity, and the ability to implement real CRUD logic in a scalable and maintainable frontend setup.

## 📌 What This Project Focuses On

- Clean code readability
- Component separation logic
- Consistent state handling and data flow
- Practical UI structure that is easy to extend and modify
- Realistic project structure similar to production setups

This is strictly technical — no over‑selling, no business pitch. Just code quality demonstration.

## 🧰 Tech Stack

| Technology | Used For |
|-----------|-----------|
| Vue.js    | Component based UI |
| TypeScript | Type safety + clarity in code structure |
| Vite | Fast dev server + optimized build |
| HTML / CSS | Styling + layout foundation |

## 🗂️ File & Folder Structure (Important)

```
src/
 ├─ components/        // Small reusable UI building blocks
 ├─ views/             // Actual page screens / route level components
 ├─ assets/            // Static assets
 └─ main.ts            // App entry
```

This separation ensures:
- views handle page logic
- components handle UI logic only
- business rules are not mixed inside UI templates

## 🔄 Branch Workflow Used During Internship

| Branch | Description |
|--------|-------------|
| development | main work branch used to implement tasks |
| main | stable final version |

History, branches, commits and progression were also part of the evaluation — showing real incremental workflow.

## 🧑‍💻 Run Locally

```sh
git clone https://github.com/Oshernee/Teltonika-Posts-System-Task.git
cd Teltonika-Posts-System-Task
npm install
npm run dev
```

Then open:
```
http://localhost:3000
```

## 📋 Scripts

```sh
npm run dev      # development server
npm run build    # production build
npm run lint     # formatting / code quality
```

---

This project demonstrates the ability to write clean modular UI logic, follow proper repository structure, and implement a realistic frontend posts system under internship task conditions.
