// ID Generator
function generateId() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

// App Code
// Constants:
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const REMOVE_TODO = 'REMOVE_TODO';

const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

// Custom Middleware implementation: This will hijack our action dispatcher and will check the
// contents of the actions first and then call store.dispatch for the respective action
function checkAndDispatch(store, action) {
  if (action.type === 'ADD_TODO' && action.todo.name.toLowerCase().indexOf('bitcoin') !== -1) {
    return alert("Nope. That's a bad idea");
  }

  if (action.type === 'ADD_GOAL' && action.goal.name.toLowerCase().indexOf('bitcoin') !== -1) {
    return alert("Nope. That's a bad idea");
  }

  return store.dispatch(action);
}

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id
  };
}

// REDUCER FUNCTION:
// We want to make our Reducer as predictable as possible and hence it has to be a pure function.
// We will defined specific rules for specific actions only and in the rest of the cases, if the
// action is not recognized, then the state will be returned as is.
// Function to handle Todos i.e. Todos Reducer
function todos(state = [] /* The current state, if it's undefined then initialize it to an empty array */,
  action /* The action that was dispatched */) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]); // Since Reducer has to be a pure function, it can't mutate the state and hence we are using .concat()
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id)
    case TOGGLE_TODO:
      return state.map((todo) => todo.id !== action.id ? todo : Object.assign({}, todo, { completed: !todo.completed }));
    default:
      return state; // If no action is matched, then return the state as is.
  }
}

// Function to handle Goals. i.e. Goals  Reducer
function goals(state = [] /* The current state, if it's undefined then initialize it to an empty array */,
  action /* The action that was dispatched */) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]); // Since Reducer has to be a pure function, it can't mutate the state and hence we are using .concat()
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id)
    default:
      return state; // If no action is matched, then return the state as is.
  }
}

// Since we have two pieces of state here, i.e. goals and todos, and currently, we are only passing
// the todos reducer to the store to handle todos only, we will need a root reducer that will sort
// of combine these two individual reducers and pass it to the store so that the appropriate action
// is dispatched to the appropriate reducer. That's what combineReducers does.

// Create a new store
// Root reducer is now passed on to the store
const store = Redux.createStore(Redux.combineReducers({
  todos,
  goals
}));

// Subscribe to the store
const unsubscribe = store.subscribe(() => {
  const { todos, goals } = store.getState();

  // This is to clear out the list since after the state gets updated we will loop through all the
  // items and add it in the ul, it should not get added multiple times in the list.
  document.getElementById('todos').innerHTML = '';
  document.getElementById('goals').innerHTML = '';

  goals.forEach(addGoalToDOM);
  todos.forEach(addTodoToDOM);
});

// ACTIONS: Actions are objects that represents the type of event that can occur in our 
// application to change the state of our store

// DOM Code:

function addTodoToDOM(todo) {
  const node = document.createElement('li');
  const text = document.createTextNode(todo.name);

  const removeBtn = createRemoveBtn(() => {
    checkAndDispatch(store, removeTodoAction(todo.id));
  })

  node.appendChild(text);
  node.appendChild(removeBtn);

  node.style.textDecoration = todo.completed ? 'line-through' : 'none';
  node.addEventListener('click', () => {
    checkAndDispatch(store, toggleTodoAction(todo.id));
  })

  document.getElementById('todos').appendChild(node);
}

function addGoalToDOM(goal) {
  const node = document.createElement('li');
  const text = document.createTextNode(goal.name);

  const removeBtn = createRemoveBtn(() => {
    checkAndDispatch(store, removeGoalAction(goal.id));
  })

  node.appendChild(text);
  node.appendChild(removeBtn);

  document.getElementById('goals').appendChild(node);
}

function createRemoveBtn(callback) {
  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = 'X';
  removeBtn.addEventListener('click', callback);
  return removeBtn;
}

function addTodo() {
  const input = document.getElementById('todo');
  const name = input.value;
  input.value = "";

  checkAndDispatch(store, addTodoAction({
    id: generateId(),
    name,
    completed: false
  }));
}

function addGoal() {
  const input = document.getElementById('goal');
  const name = input.value;
  input.value = "";

  checkAndDispatch(store, addGoalAction({
    id: generateId(),
    name,
  }));
}

document.getElementById('todoBtn').addEventListener('click', addTodo);
document.getElementById('goalBtn').addEventListener('click', addGoal);