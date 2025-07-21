document.addEventListener("DOMContentLoaded", () => {
  const navTabs = document.querySelectorAll(".nav-tab");
  const sections = document.querySelectorAll(".section");

  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetSection = tab.getAttribute("data-section");

      navTabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(targetSection).classList.add("active");
    });
  });
});

function animateReduxFlow() {
  if (appState.currentAnimation) return; // Prevent multiple triggers

  const items = ["view-item", "action-item", "reducer-item", "store-item"];
  let currentIndex = 0;

  // Reset all items
  items.forEach((id) => {
    document.getElementById(id).classList.remove("active");
  });

  appState.currentAnimation = setInterval(() => {
    if (currentIndex > 0) {
      document
        .getElementById(items[currentIndex - 1])
        .classList.remove("active");
    }

    document.getElementById(items[currentIndex]).classList.add("active");
    currentIndex++;

    if (currentIndex >= items.length) {
      clearInterval(appState.currentAnimation);
      appState.currentAnimation = null;

      // Show explanation after animation finishes
      document.getElementById("redux-info-text").style.display = "block";
    }
  }, 1000);
}

function resetAnimation() {
  if (appState.currentAnimation) {
    clearInterval(appState.currentAnimation);
    appState.currentAnimation = null;
  }

  const items = ["view-item", "action-item", "reducer-item", "store-item"];
  items.forEach((id) => {
    document.getElementById(id).classList.remove("active");
  });

  // Hide explanation text
  document.getElementById("redux-info-text").style.display = "none";
}

// Usage section functions
function showActionCreators() {
  document.getElementById("usage-code").innerHTML = `
                <strong>Action Creators:</strong><br><br>
// Action Types<br>
const INCREMENT = 'INCREMENT';<br>
const DECREMENT = 'DECREMENT';<br>
const ADD_TODO = 'ADD_TODO';<br><br>

// Action Creators<br>
const increment = (amount = 1) => ({<br>
&nbsp;&nbsp;type: INCREMENT,<br>
&nbsp;&nbsp;payload: amount<br>
});<br><br>

const addTodo = (text) => ({<br>
&nbsp;&nbsp;type: ADD_TODO,<br>
&nbsp;&nbsp;payload: {<br>
&nbsp;&nbsp;&nbsp;&nbsp;id: Date.now(),<br>
&nbsp;&nbsp;&nbsp;&nbsp;text: text,<br>
&nbsp;&nbsp;&nbsp;&nbsp;completed: false<br>
&nbsp;&nbsp;}<br>
});<br><br>

// Dispatch actions<br>
store.dispatch(increment(5));<br>
store.dispatch(addTodo('Learn Redux'));
            `;
}

function showMiddleware() {
  document.getElementById("usage-code").innerHTML = `
                <strong>Redux Middleware:</strong><br><br>
import { applyMiddleware, createStore } from 'redux';<br><br>

// Logger Middleware<br>
const logger = store => next => action => {<br>
&nbsp;&nbsp;console.log('dispatching', action);<br>
&nbsp;&nbsp;let result = next(action);<br>
&nbsp;&nbsp;console.log('next state', store.getState());<br>
&nbsp;&nbsp;return result;<br>
};<br><br>

// Thunk Middleware for async actions<br>
const thunk = store => next => action => {<br>
&nbsp;&nbsp;if (typeof action === 'function') {<br>
&nbsp;&nbsp;&nbsp;&nbsp;return action(store.dispatch, store.getState);<br>
&nbsp;&nbsp;}<br>
&nbsp;&nbsp;return next(action);<br>
};<br><br>

// Apply middleware<br>
const store = createStore(reducer, applyMiddleware(logger, thunk));
            `;
}

function showAsyncActions() {
  document.getElementById("usage-code").innerHTML = `
                <strong>Async Actions with Thunk:</strong><br><br>
// Async action creator<br>
const fetchUser = (userId) => {<br>
&nbsp;&nbsp;return async (dispatch, getState) => {<br>
&nbsp;&nbsp;&nbsp;&nbsp;dispatch({ type: 'FETCH_USER_START' });<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;try {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const response = await fetch(\`/api/users/\${userId}\`);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const user = await response.json();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dispatch({<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: 'FETCH_USER_SUCCESS',<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;payload: user<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});<br>
&nbsp;&nbsp;&nbsp;&nbsp;} catch (error) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dispatch({<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: 'FETCH_USER_ERROR',<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;payload: error.message<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});<br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br>
&nbsp;&nbsp;};<br>
};<br><br>

// Usage<br>
store.dispatch(fetchUser(123));
            `;
}

// Global state simulation
let appState = {
  cart: [],
  counter: 0,
  todos: [],
  currentAnimation: null,
};

// Load cart from localStorage on init
window.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("reduxCart");
  if (savedCart) {
    try {
      appState.cart = JSON.parse(savedCart);
      renderCart();
    } catch (e) {
      console.error("Invalid cart data in localStorage.");
    }
  }
});

// Save cart to localStorage
function persistCart() {
  localStorage.setItem("reduxCart", JSON.stringify(appState.cart));
}

// Cart Functions
function addProductToCart() {
  const name = document.getElementById("product-name").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);
  const quantity = parseInt(document.getElementById("product-quantity").value);

  if (!name || isNaN(price) || isNaN(quantity) || price < 0 || quantity < 1) {
    alert("Please enter valid product details.");
    return;
  }

  const newItem = {
    id: Date.now(),
    name,
    price,
    quantity,
  };

  appState.cart.push(newItem);
  renderCart();
  persistCart();
  clearInputs();
}

function clearInputs() {
  document.getElementById("product-name").value = "";
  document.getElementById("product-price").value = "";
  document.getElementById("product-quantity").value = "";
}

function clearCart() {
  if (!confirm("Are you sure you want to clear the entire cart?")) return;
  appState.cart = [];
  renderCart();
  persistCart();
}

function renderCart() {
  const cartList = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total-price");
  cartList.innerHTML = "";

  let total = 0;
  appState.cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    li.innerHTML = `
      <span style="flex-grow:1;">
        ${item.name} - $${item.price} × ${item.quantity} = $${itemTotal.toFixed(
      2
    )}
      </span>
      <button class="btn btn-danger" style="padding: 5px 10px; font-size: 0.8em;" onclick="removeFromCart(${
        item.id
      })">
        🗑️ Remove
      </button>
    `;
    cartList.appendChild(li);
  });

  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(id) {
  appState.cart = appState.cart.filter((item) => item.id !== id);
  renderCart();
  persistCart();
}

// Redux State Debugger Simulator
const stateDebugger = {
  log: [],
  pointer: -1,
};

function dispatchDebuggerAction(action, reducerFn) {
  const prevState = JSON.parse(JSON.stringify(appState));
  reducerFn(action);
  const newState = JSON.parse(JSON.stringify(appState));

  stateDebugger.log = stateDebugger.log.slice(0, stateDebugger.pointer + 1);
  stateDebugger.log.push({ action, prevState, newState });
  stateDebugger.pointer++;

  renderDebuggerLog();
}

function renderDebuggerLog() {
  const logList = document.getElementById("debugger-log");
  logList.innerHTML = "";
  stateDebugger.log.forEach((entry, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Action:</strong> ${entry.action.type}<br>
      <code>${JSON.stringify(entry.newState, null, 2)}</code>
      <br>
      <button class='btn btn-primary' onclick='timeTravelTo(${index})'>⏪ Travel to Step ${
      index + 1
    }</button>
    `;
    li.style.marginBottom = "20px";
    li.style.padding = "10px";
    li.style.background = "#f1f1f1";
    li.style.borderRadius = "10px";
    logList.appendChild(li);
  });
  document.getElementById("undo-btn").disabled = stateDebugger.pointer <= 0;
  document.getElementById("redo-btn").disabled =
    stateDebugger.pointer >= stateDebugger.log.length - 1;
}

function timeTravelTo(index) {
  const snapshot = stateDebugger.log[index];
  appState = JSON.parse(JSON.stringify(snapshot.newState));
  stateDebugger.pointer = index;
  renderCart();
  renderDebuggerLog();
}

function undo() {
  if (stateDebugger.pointer > 0) {
    timeTravelTo(stateDebugger.pointer - 1);
  }
}

function redo() {
  if (stateDebugger.pointer < stateDebugger.log.length - 1) {
    timeTravelTo(stateDebugger.pointer + 1);
  }
}

function toggleInstructions(type) {
  const id = `${type}-instructions`;
  const block = document.getElementById(id);
  block.style.display = block.style.display === "none" ? "block" : "none";
}

// 🔁 Load saved code from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  ["store", "slice", "ui", "dispatch"].forEach((id) => {
    const saved = localStorage.getItem(`reduxCode-${id}`);
    if (saved) {
      document.getElementById(`${id}-code`).value = saved;
    }
  });
});

// 💾 Save user code to localStorage on input
["store", "slice", "ui", "dispatch"].forEach((id) => {
  const textarea = document.getElementById(`${id}-code`);
  textarea.addEventListener("input", () => {
    localStorage.setItem(`reduxCode-${id}`, textarea.value);
  });
});

// 🚀 Combine code and run inside iframe
function executeReduxCode() {
  const sliceCode = document.getElementById("slice-code").value;
  const storeCode = document.getElementById("store-code").value;
  const uiCode = document.getElementById("ui-code").value;
  const dispatchCode = document.getElementById("dispatch-code").value;

  const iframe = document.getElementById("redux-preview");
  const errorBox = document.getElementById("redux-error");
  errorBox.textContent = "";

  const fullHtml = `
    <html>
      <head>
        <title>Redux Preview</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          button { margin: 5px; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@reduxjs/toolkit@1.9.5/dist/redux-toolkit.umd.js"></script>
        <script src="https://unpkg.com/react-redux@8.1.1/dist/react-redux.umd.js" onload="initApp()"></script>

        <script>
          function initApp() {
            try {
              const { createSlice, configureStore } = window.RTK;
              const { Provider, useDispatch, useSelector } = window.ReactRedux;
              const React = window.React;
              const ReactDOM = window.ReactDOM;

              ${sliceCode}
              ${storeCode}
              ${dispatchCode}
              ${uiCode}

              ReactDOM.createRoot(document.getElementById('root')).render(
                React.createElement(Provider, { store },
                  React.createElement(App)
                )
              );
            } catch (err) {
              parent.document.getElementById('redux-error').textContent = err.message;
            }
          }
        </script>
      </body>
    </html>
  `;

  const blob = new Blob([fullHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  iframe.src = url;
}

function executeReduxCode() {
  const storeCode = document.getElementById('store-code').value;
  const sliceCode = document.getElementById('slice-code').value;
  const uiCode = document.getElementById('ui-code').value;
  const dispatchCode = document.getElementById('dispatch-code').value;

  const combinedCode = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Redux Live Preview</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        button {
          padding: 10px 20px;
          margin: 5px;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.development.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.development.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/redux/4.2.1/redux.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/8.1.2/react-redux.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@reduxjs/toolkit@1.9.5/dist/redux-toolkit.umd.min.js"></script>

      <script>
        const { createSlice, configureStore } = window.RTK;
        const { Provider, useSelector, useDispatch } = window.ReactRedux;
        const React = window.React;
        const ReactDOM = window.ReactDOM;

        ${sliceCode}

        ${storeCode}

        ${dispatchCode}

        ${uiCode}
      </script>
    </body>
    </html>
  `;

  const iframe = document.getElementById('redux-preview');
  const errorBox = document.getElementById('redux-error');

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(combinedCode);
    iframeDoc.close();
    errorBox.textContent = ''; // Clear previous errors
  } catch (err) {
    errorBox.textContent = '❌ ' + err.message;
  }
}
