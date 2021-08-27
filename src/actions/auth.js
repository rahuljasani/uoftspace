// Import relevant action types for authentication
import { REGISTER_SUCCESS, REGISTER_ERROR, LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_EMAIL_ERROR } from "./actionTypes";
import firebase from "../services/firebase";

// Registering with Firebase with email and password
export const register = (email, password, firstname, lastname, callback) => async dispatch => {
    // Try to register user iff successful dispatch REGISTER_SUCCESS else REGISTER_ERROR
    try {
        const db = firebase.firestore();
        var registeredUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
        db.collection("users").doc(registeredUser.user.uid).set({
            email: email,
            firstname: firstname,
            lastname: lastname
        });
        await registeredUser.user.sendEmailVerification();
        dispatch({
            type: REGISTER_SUCCESS,
            payload: "Account created successfully. Must verify email to log in"
        });
        console.log(callback);
        callback();
    } catch (err) {
        console.log(err)
        dispatch({
            type: REGISTER_ERROR,
            payload: "Account was not created oh oh!"
        });
    }
};

export const createUser = (uid, email, displayName, avatarUrl) => {
  const db = firebase.firestore();
  db.collection("users").doc(uid).set({
      email: email,
      firstname: "",
      lastname: "",
      avatarUrl: avatarUrl
  });
};


// Login with firebase email and password
export const login = (email, password, callback) => async dispatch => {
    // Try to register user iff successful dispatch AUTH_SUCCESS else AUTH_ERROR
    try {
        var user = await firebase.auth().signInWithEmailAndPassword(email, password);
        if (!user.user.emailVerified) {
            dispatch({
                type: LOGIN_EMAIL_ERROR,
                payload: "Please verify your email"
            });
        } else {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: "Login Successful"
            });
            callback();
        }

    } catch (err) {
        dispatch({
            type: LOGIN_ERROR,
            payload: "Invalid Creds"
        });
    }
};

// GOOGLE AUTHENTICATION

export const googleAuth = (callback) => async dispatch => {
  // Google provider object
  var provider = new firebase.auth.GoogleAuthProvider();
  // sign in with a pop up using the google provider object
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;

    // The signed-in user info.
    var user = result.user;
    console.log(user);
    if (result.additionalUserInfo.isNewUser) {
      // make the user
      createUser(user.uid, user.email, user.displayName, user.avatarUrl);
      dispatch({
          type: LOGIN_SUCCESS,
          payload: "Login Successful"
      });
      // login is correct - go to registration
      callback(result.additionalUserInfo.isNewUser);
    }
    else if(user.emailVerified){
      dispatch({
          type: LOGIN_SUCCESS,
          payload: "Login Successful"
      });
      // login is correct - go to registration
      callback();
    } 
    else {
      dispatch({
          type: LOGIN_EMAIL_ERROR,
          payload: "Please verify your email"
      });
    }
  }).catch(function(err) {
    console.log(err);
    dispatch({
        type: LOGIN_ERROR,
        payload: "Invalid Creds"
    });
  });
};


// TWITTER AUTHENTICATION
export const twitterAuth = (callback) => async dispatch => {
  // Google provider object
  var provider = new firebase.auth.TwitterAuthProvider();
  // sign in with a pop up using the google provider object
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    
    if (result.additionalUserInfo.isNewUser) {
      // make the user
      createUser(user.uid, user.email, user.displayName, user.avatarUrl);
      dispatch({
          type: LOGIN_SUCCESS,
          payload: "Login Successful"
      });
      // login is correct - go to registration
      callback(result.additionalUserInfo.isNewUser);
    }
    else if(user.emailVerified){
      // TWITTER USSER LOGIN
      dispatch({
          type: LOGIN_SUCCESS,
          payload: "Login Successful"
      });
      // login is correct - go to registration
      callback();
    } else {
      dispatch({
          type: LOGIN_EMAIL_ERROR,
          payload: "Please verify your email"
      });
    }
  }).catch(function(err) {
    dispatch({
        type: LOGIN_ERROR,
        payload: "Invalid Creds"
    });
  });
};




// FACEBOOK AUTHENTICATION
export const facebookAuth = (callback) => async dispatch => {
  // Google provider object
  var provider = new firebase.auth.FacebookAuthProvide();
  // sign in with a pop up using the google provider object
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    if (result.additionalUserInfo.isNewUser) {
      // make the user
      createUser(user.uid, user.email, user.displayName, user.avatarUrl);
      dispatch({
          type: LOGIN_SUCCESS,
          payload: "Login Successful"
      });
      // login is correct - go to registration
      callback(result.additionalUserInfo.isNewUser);
    }
    else if(user.emailVerified){
      dispatch({
          type: LOGIN_SUCCESS,
          payload: "Login Successful"
      });
      // login is correct - go to registration
      callback();
    } else {
      dispatch({
          type: LOGIN_EMAIL_ERROR,
          payload: "Please verify your email"
      });
    }
  }).catch(function(err) {
    dispatch({
        type: LOGIN_ERROR,
        payload: "Invalid Creds"
    });
  });
};
