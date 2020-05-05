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
const RECEIVE_DATA = 'RECEIVE_DATA';

// Redux Middleware implementation: This will hijack our action dispatcher and will check the
// contents of the actions first and then call store.dispatch for the respective action

const checker = (store) => (next) => (action) => {
  if (action.type === 'ADD_TODO' && action.todo.name.toLowerCase().indexOf('bitcoin') !== -1) {
    return alert("Nope. That's a bad idea");
  }

  if (action.type === 'ADD_GOAL' && action.goal.name.toLowerCase().indexOf('bitcoin') !== -1) {
    return alert("Nope. That's a bad idea");
  }
  // next = Next middleware in the chain
  return next(action);
}

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('The action: ', action);
  const result = next(action);
  console.log("The new state: ", store.getState());
  console.groupEnd()

  return result;
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

function receiveDataFromAPI(todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals
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
    case RECEIVE_DATA:
      return action.todos
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
    case RECEIVE_DATA:
      return action.goals
    default:
      return state; // If no action is matched, then return the state as is.
  }
}

function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
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
  goals,
  loading
}), Redux.applyMiddleware(checker, logger));
