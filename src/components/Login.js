// JUST A SIDE NOTE: remember paraent components can render other child
// SHOULD HAVE A USER COMPONENT

import React, { useState } from "react";
import { connect } from "react-redux";
import { login, googleAuth, twitterAuth, facebookAuth } from "../actions/auth";

import './index.css'
import logo from './Assets/uoft-logo.png';
import twitter from './Assets/twitter.png';
import facebook from './Assets/facebook.png';
import gmail from './Assets/gmail.png';

const Login = ({login, authMsg, history, googleAuth, twitterAuth, facebookAuth }) => {

  // TODO: Seperate the forum from the syling aspects
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  // As the field changes update our state
  const handleChange = (e) => {
    e.persist();
    setCredentials({
      ...credentials,
      [e.target.name] : e.target.value
    });
  }

  const handleSubmission = (e) => {
    // Prevents resubmission
    e.preventDefault();
    //TODO: The path is temp, can route this later once we decide on one
    setCredentials({
      email: credentials.email,
      password: credentials.password,
    });
    login(credentials.email, credentials.password, () => {history.push('/home')});

    // Reset the state
    setCredentials({
      email: "",
      password: ""
    });
  }

  return (
    <div className="page-center" >
      <div className = "UofT-Space">
        <img className="logo" src={logo} alt="UofT Space" />
      </div>

      <div className ="register-form">
        <form id="mainForm" onSubmit={ handleSubmission }>
          <input id="txtEmail" placeholder="Email" type="email" value={ credentials.email } onChange={ handleChange } name="email" />
          <br/>
          <input id="txtPass" placeholder="Password" type="password" value={ credentials.password }onChange={ handleChange } name="password" />
          <br/>
          <input className="login-button grow" id="submit" type="submit" name="submit" value="Login" onSubmit={ handleSubmission } />
        </form>
      </div>

      <div className="logo-container">
        <div className = "social-media-logo grow"><a href="#" onClick={() => {twitterAuth((newUser) => {newUser ? history.push('/profile') : history.push('/home')})}}><img id="icon" src={twitter} alt="Twitter"/></a></div>
        <div className = "social-media-logo grow"><a href="#" onClick={() => {facebookAuth((newUser) => {newUser ? history.push('/profile') : history.push('/home')})}}><img id="icon" src={facebook} alt="facebook"/></a></div>
        <div className = "social-media-logo grow"><a href="#" onClick={() => {googleAuth((newUser) => {newUser ? history.push('/profile') : history.push('/home')})}}> <img id="icon" src={gmail} alt="Gmail"/> </a></div>
      </div>
      <div>
        <button className="create-account grow" onClick={() => {history.push("registeration")}}> Register </button>
        <p>{authMsg ? authMsg: ""}</p>
      </div>

    </div>
  );
}

function mapStateToProps(state) {
  return {
    authMsg: state.authReducer.authMsg,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (email, password, callback) =>
      dispatch(login(email, password, callback)),
    googleAuth: (callback) =>
      dispatch(googleAuth(callback)),
    twitterAuth: (callback) =>
      dispatch(twitterAuth(callback)),
    facebookAuth: (callback) =>
      dispatch(facebookAuth(callback)),
  };
}

export default connect (
  mapStateToProps,
  mapDispatchToProps,
)(Login);
