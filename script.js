// REDUCER FUNCTION:
// We want to make our Reducer as predictable as possible and hence it has to be a pure function.
// We will defined specific rules for specific actions only and in the rest of the cases, if the
// action is not recognized, then the state will be returned as is.
// Function to handle Todos i.e. Todos Reducer
function todos(state = [] /* The current state, if it's undefined then initialize it to an empty array */,
  action /* The action that was dispatched */) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.todo]); // Since Reducer has to be a pure function, it can't mutate the state and hence we are using .concat()
    case 'REMOVE_TODO':
      return state.filter((todo) => todo.id !== action.id)
    case 'TOGGLE_TODO':
      return state.map((todo) => todo.id !== action.id ? todo : Object.assign({}, todo, { completed: !todo.completed }));
    default:
      return state; // If no action is matched, then return the state as is.
  }
}

// Function to handle Goals. i.e. Goals  Reducer
function goals(state = [] /* The current state, if it's undefined then initialize it to an empty array */,
  action /* The action that was dispatched */) {
  switch (action.type) {
    case 'ADD_GOAL':
      return state.concat([action.goal]); // Since Reducer has to be a pure function, it can't mutate the state and hence we are using .concat()
    case 'REMOVE_GOAL':
      return state.filter((goal) => goal.id !== action.id)
    default:
      return state; // If no action is matched, then return the state as is.
  }
}

// Since we have two pieces of state here, i.e. goals and todos, and currently, we are only passing
// the todos reducer to the store to handle todos only, we will need a root reducer that will sort
// of combine these two individual reducers and pass it to the store so that the appropriate action
// is dispatched to the appropriate reducer.
function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  }
}

// STORE:
// The store has four parts:
// 1. The State
// 2. Get the state
// 3. Listen to changes on the state
// 4. Update the state
function createStore(reducer) {
  // Initial state
  let state;

  // This will consist of all the objects that are listening to the changes in the store
  // When the store gets updated, we will loop through all available listeners and then
  // notify each one of them of the change that has occurred.
  let listeners = [];

  // Function to get the current state
  const getState = () => state;

  // Observer pattern
  // Function to subscribe to the store
  // We will pass the listener object as a parameter
  const subscribe = (listener) => {
    // When a listener subscribes to the store we add it into the list of listeners
    listeners.push(listener);
    // Returns a function to unsubscribe to the updates of the store
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  // The update function should have a strict set of rules on how they update the store to
  // maintain predictability of our application. We should not allow anything to update the
  // state of our store. This is achieved through having a set of actions which will update
  // the store in a specific way. Kind of like a play book for professional sport teams.
  // For updating the stae we will use a dispatcher which will dispath the action to the 
  // reducer
  const dispatch = (action) => {
    // Get the updated state
    state = reducer(state, action);
    // Notify all the objects listening to the store that the store was updated
    listeners.forEach((listener) => listener());
  }

  // The store object
  return {
    getState,
    subscribe,
    dispatch
  };
}

// Create a new store
// Root reducer is now passed on to the store
const store = createStore(app);

const unsubscribe = store.subscribe(() => {
  console.log('The new store is: ', store.getState());
})

// ACTIONS: Actions are objects that represents the type of event that can occur in our 
// application to change the state of our store
store.dispatch({
  // Event identifier to add a todo
  type: 'ADD_TODO',
  // The todo object to be added
  todo: {
    id: 0,
    name: 'Learn Redux',
    completed: false
  }
})

store.dispatch({
  // Event identifier to add a todo
  type: 'ADD_TODO',
  // The todo object to be added
  todo: {
    id: 1,
    name: 'Learn Vue.js',
    completed: false
  }
})

store.dispatch({
  // Event identifier to add a todo
  type: 'ADD_TODO',
  // The todo object to be added
  todo: {
    id: 2,
    name: 'Learn Snowboarding',
    completed: false
  }
})

store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0
})

store.dispatch({
  type: 'REMOVE_TODO',
  id: 2
})

store.dispatch({
  // Event identifier to add a long term goal
  type: 'ADD_GOAL',
  // The goal object to be added
  goal: {
    id: 0,
    name: 'Run a Marathon',
  }
})

store.dispatch({
  // Event identifier to add a long term goal
  type: 'ADD_GOAL',
  // The goal object to be added
  goal: {
    id: 1,
    name: 'Open a company',
  }
})

store.dispatch({
  // Event identifier to add a long term goal
  type: 'ADD_GOAL',
  // The goal object to be added
  goal: {
    id: 2,
    name: 'Gain six pack',
  }
})

store.dispatch({
  // Event identifier to remove a goal
  type: 'REMOVE_GOAL',
  // The goal object to be removed
  id: 1
})