// ACTIONS: Actions are objects that represents the type of event that can occur in our 
// application to change the state of our store
const addTodo = {
  // Event identifier to add a todo
  type: 'ADD_TODO',
  // The todo object to be added
  todo: {
    id: 0,
    name: 'Learn Redux',
    completed: false
  }
}

const removeTodo = {
  // Event identifier to remove a todo
  type: 'ADD_TODO',
  // The todo object to be removed
  id: 0
}

const toggleTodo = {
  // Event identifier to toggle a todo
  type: 'ADD_TODO',
  // The todo object to be toggled
  id: 0
}

const addGoal = {
  // Event identifier to add a long term goal
  type: 'ADD_GOAL',
  // The goal object to be added
  goal: {
    id: 0,
    name: 'Run a Marathon',
  }
}

const removeTodo = {
  // Event identifier to remove a goal
  type: 'REMOVE_TODO',
  // The goal object to be removed
  id:0
}

// The store has four parts:
// 1. The State
// 2. Get the state
// 3. Listen to changes on the state
// 4. Update the state
function createStore() {
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
  
  // The store object
  return {
      getState,
      subscribe
  };
}

// Create a new store
const store = createStore();