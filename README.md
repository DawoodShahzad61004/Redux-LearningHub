
# Redux Learning Simulator 🧠

This is an interactive, visually-rich web project to help learners understand the fundamentals and flow of Redux. It simulates Redux architecture, allows practicing Redux code directly in the browser, and includes features like time travel debugging, quizzes, animations, and a shopping cart demo.

---

## 🌐 Live Demo Features

- **Redux Diagram Animation**: Simulates View → Action → Reducer → Store flow.
- **Redux Usage Examples**: Shows Action Creators, Middleware, Thunk, Async examples.
- **Code Practice Area**: Type and execute custom slice, store, dispatch, and UI code.
- **Cart Demo**: Visual cart with `localStorage` persistence and debugger.
- **Redux Debugger**: Allows time-traveling between previous states.
- **Interactive Quizzes**: Assess your Redux knowledge.
- **Responsive UI**: Fully styled with modern CSS and mobile-friendly layout.

---

## 🧱 Project Structure

```plaintext
.
├── index.html       # Main structure and content
├── index.js         # JavaScript interactivity and Redux logic
├── styles.css       # Custom styling and animations
```

---

## 🚀 How to Run

1. Clone/download the project and open `index.html` in your browser.
2. Type your Redux code in the Practice section.
3. Click `Execute` to preview your React + Redux component live inside the embedded iframe.

---

## ⚙️ Technologies Used

- **React (via CDN)** – UI Rendering
- **React DOM**
- **Redux Toolkit**
- **React Redux**
- **Vanilla JS** – DOM interaction & custom debugger
- **LocalStorage** – Persistence
- **Pure CSS** – Styling, animations, and transitions

---

## ⚠️ Common Errors & How They Were Resolved

### 1. ❌ `Uncaught SyntaxError: Cannot use import statement outside a module`
- **Cause**: Attempting to use `import` inside `<script>` tags in the iframe execution environment.
- **Fix**: Replaced all imports with UMD CDN-based scripts (React, ReactDOM, Redux Toolkit, React-Redux) and used their global variables like `window.ReactRedux.Provider`, `window.RTK.createSlice`, etc.

---

### 2. ❌ `Cannot destructure property 'Provider' of 'window.ReactRedux' as it is undefined`
- **Cause**: Trying to use `Provider` before the external React-Redux script had loaded.
- **Fix**: Ensured initialization using `onload="initApp()"` on the `<script>` tag for `react-redux`. Later replaced with UMD-safe declaration inside the iframe and removed `onload` reliance.

---

### 3. ❌ `Uncaught SyntaxError: Unexpected token '<'`
- **Cause**: Writing JSX inside the iframe script without Babel transpilation.
- **Fix**: Converted all JSX code to `React.createElement` form or used string-concatenated vanilla HTML for previews. Also made sure that pasted code inside the practice area doesn't rely on JSX.

---

### 4. ⚠️ Code not executing in iframe
- **Cause**: Iframe was not loading dynamically generated content correctly.
- **Fix**: Used `Blob` and `URL.createObjectURL()` to dynamically inject user code into iframe as a new document with all required script tags.

---

### 5. ⚠️ Cart data not persisting
- **Fix**: Implemented `localStorage.getItem()` and `localStorage.setItem()` within the cart module. Added a check on `DOMContentLoaded` to load existing cart data.

---

### 6. ❌ Duplicate DOMContentLoaded event listener warnings
- **Fix**: Combined duplicate `DOMContentLoaded` listeners into a single block and scoped logic accordingly.

---

## ✅ To Do / Ideas

- [ ] Add Redux DevTools support via middleware.
- [ ] Export code snippets as downloadable files.
- [ ] Add ESLint or live error linting to code editor area.
- [ ] Syntax highlighting in the code editor using a library (e.g., Prism.js).

---

## 🔗 Live Demo

**[Redux Learning Hub – Hosted on GitHub Pages](https://dawoodshahzad61004.github.io/Redux-LearningHub/)**

---

## 👨‍💻 Developed by Dawood Shahzad  
For learning, teaching, and debugging Redux from scratch.
