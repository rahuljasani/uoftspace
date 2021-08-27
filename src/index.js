import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";

// The app we are rendering 
import App from './components/App';

// Creating the store 
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux'; 
import reducers from './reducers/index';
import firebase from './services/firebase'

// React-Redux-Firebase the store 
import  thunk  from "redux-thunk"
import { ReactReduxFirebaseProvider , firebaseReducer } from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore'

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
  enableClaims: true

}

// Initialize other services on firebase instance
firebase.firestore();
firebase.messaging();
firebase.storage();
firebase.functions(); 
firebase.database();

// Add firebase to reducers
const rootReducer = combineReducers({
  reducers: reducers, 
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
})

// Create store with reducers and initial state
const initialState = {}
const store = createStore(rootReducer, initialState,  applyMiddleware(thunk))

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance 
}
// Setup react-redux so that connect HOC can be used
render (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <App />
      </ReactReduxFirebaseProvider>
    </Provider>
    , document.getElementById('root'))

// render(<App/>, document.getElementById('root'));