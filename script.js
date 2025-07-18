/* ==========  UTILS  ========== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const log = console.log;

/* ==========  PROGRESS BAR  ========== */
const progressFill = $('#progressFill');
const sections = $$('.section');
const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(e => e.isIntersecting).length;
  const pct = (visible / sections.length) * 100;
  progressFill.style.width = pct + '%';
}, { threshold: .5 });
sections.forEach(s => observer.observe(s));

/* ==========  INTRO QUIZ  ========== */
$('#intro-quiz').addEventListener('click', e => {
  if (!e.target.classList.contains('quiz-option')) return;
  const option = e.target;
  const correct = option.dataset.correct === 'true';
  option.classList.add(correct ? 'correct' : 'wrong');
  $$('.quiz-option').forEach(btn => btn.disabled = true);
  $('#intro-feedback').textContent = correct
    ? '✅ Correct! Redux manages global state.'
    : '❌ Try again – Redux is for state management.';
});

/* ==========  STORE DEMO  ========== */
let miniStore = null;
const initialState = { counter: 0, todos: [] };

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT': return { ...state, counter: state.counter + 1 };
    case 'DECREMENT': return { ...state, counter: state.counter - 1 };
    case 'RESET': return { ...state, counter: 0 };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text: action.payload, done: false }]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, done: !t.done } : t
        )
      };
    default: return state;
  }
}

$('#create-store-btn').onclick = () => {
  miniStore = Redux.createStore(counterReducer);
  $('#get-state-btn').disabled = false;
  updateStoreDisplay();
};
$('#get-state-btn').onclick = updateStoreDisplay;

function updateStoreDisplay() {
  $('#store-state-display').textContent = JSON.stringify(
    miniStore ? miniStore.getState() : {},
    null,
    2
  );
}

/* ==========  ACTION BUILDER  ========== */
window.buildAction = () => {
  const type = $('#action-type').value.trim();
  let payload;
  try {
    payload = $('#action-payload').value.trim()
      ? JSON.parse($('#action-payload').value.trim())
      : undefined;
  } catch {
    $('#action-output').textContent = '⚠️ Invalid JSON';
    return;
  }
  const action = payload !== undefined ? { type, payload } : { type };
  $('#action-output').textContent = JSON.stringify(action, null, 2);
};

/* ==========  REDUCER PLAYGROUND  ========== */
let pgState = 0;
const historyUl = $('#action-history');
function dispatchAction(type) {
  pgState = counterReducer({ counter: pgState }, { type }).counter;
  $('#reducer-state').textContent = pgState;
  const li = document.createElement('li');
  li.textContent = type;
  historyUl.appendChild(li);
}

/* ==========  TODO LIST  ========== */
const todoStore = Redux.createStore(counterReducer);
window.addTodo = () => {
  const text = $('#todo-text').value.trim();
  if (!text) return;
  todoStore.dispatch({ type: 'ADD_TODO', payload: text });
  $('#todo-text').value = '';
  renderTodos();
};
function renderTodos() {
  const ul = $('#todos-container');
  ul.innerHTML = '';
  todoStore.getState().todos.forEach(todo => {
    const li = document.createElement('li');
    li.innerHTML = `
      <label>
        <input type="checkbox" ${todo.done ? 'checked' : ''} 
               onchange="toggleTodo(${todo.id})">
        ${todo.text}
      </label>
    `;
    ul.appendChild(li);
  });
}
window.toggleTodo = id => {
  todoStore.dispatch({ type: 'TOGGLE_TODO', id });
  renderTodos();
};

/* ==========  REACT-REDUX SIMULATOR  ========== */
let reactCount = 0;
const updateReactPreview = () => {
  $('#react-count').textContent = reactCount;
  $('#component-code-display').textContent = `
const count = useSelector(state => state.counter);
const dispatch = useDispatch();

return (
  <div>
    <p>Count: {count}</p>
    <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
    <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
  </div>
);
  `.trim();
};
window.reactIncrement = () => {
  reactCount++;
  updateReactPreview();
};
window.reactDecrement = () => {
  reactCount--;
  updateReactPreview();
};
updateReactPreview();

/* ==========  MIDDLEWARE LOGGER  ========== */
const loggerDiv = $('#logger-messages');
window.middlewareAction = type => {
  const entry = document.createElement('div');
  entry.innerHTML = `
    <p>🛰️  Dispatching: <strong>${type}</strong></p>
    <p>🔄  Next state: ${JSON.stringify({ lastAction: type })}</p>
    <hr>
  `;
  loggerDiv.appendChild(entry);
  loggerDiv.scrollTop = loggerDiv.scrollHeight;
};

/* ==========  PRISM SYNTAX HIGHLIGHT  ========== */
Prism.highlightAll();
