import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import '../index.css'
import logo from '../Assets/uoft-logo.png';
import { useFirebase, useFirestore } from "react-redux-firebase";
import firebase from '../../services/firebase'
import NavbarCustom from '../Navbar/Navbar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


import { toast } from "react-toastify";
toast.configure();

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const Registration = ({ client }) => {
  const fb = useFirebase(); 
  const fs = useFirestore()
  const history = useHistory()
  const [credentials, setCredentials] = useState({ 
    email: "", 
    password: "",
    firstname: "",
    lastname: ""
  });

  const [error, setError] = useState("");
  const [isRegistering, setRegistering] = useState(false);
  const classes = useStyles();

  // As the field changes update our state
  const handleChange = (e) => {
    e.persist();
    setCredentials({
      ...credentials,
      [e.target.name] : e.target.value
    });
  }

  const handleSubmission = async (e) => {
    // Prevents resubmission
    e.preventDefault();
    handleChange(e);
    try {
      setRegistering(true);
      var email = credentials.email,
      password = credentials.password,
      firstname = credentials.firstname,
      lastname = credentials.lastname,
      phoneNumber = credentials.phoneNumber
      console.log(credentials)
      
      // This will automatically add the user to the users collection 
      await fb.createUser(
        {email, password},
        {email : email, firstname: firstname, lastname: lastname, phoneNumber: phoneNumber}
      );

      // Reset the state
      setCredentials({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        phoneNumber: "",
      });
    } catch (err) {
      setError(err.message)
      setRegistering(false)
    } 
  }

  // Check for erros 
  useEffect(() => {
    if (!error) return 
    else toast(error, { type: 'error'}); 
    setError("")
  }, [error]);


    //When a user registers sucessfully they get signed in automatically, detect the signin and send back to login page
    useEffect(() => {
      if (client.isEmpty) return 
      else if (isRegistering) {
        firebase.auth().currentUser.updateProfile({photoURL: "https://i.imgur.com/b08hxPY.png" }).then(async () => {
          await firebase.auth().currentUser.sendEmailVerification()
          setRegistering(false)
        })

      }
    }, [client]);

  //When a user registers sucessfully they get signed in automatically, detect the signin and send back to login page
  useEffect(() => {
    if (client.isEmpty) return 
    else toLogin(); 
  }, [isRegistering]);

  const toLogin = () => {
    history.push('/login')
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={ handleSubmission }>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstname"
                variant="outlined"
                required
                fullWidth
                id="firstname"
                label="First Name"
                autoFocus
                onChange={ handleChange }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastname"
                label="Last Name"
                name="lastname"
                autoComplete="lname"
                onChange={ handleChange }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="phoneNumber"
                onChange={ handleChange }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={ handleChange }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={ handleChange }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onSubmit={ handleSubmission }
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );

  // return (
  //   <div className="authBody">
  //     <NavbarCustom/>

  //     <br/>
  //     <br/>

  //     <div className="page-center" >
  //       <div className = "UofT-Space">
  //         <img className="logo" src={logo} alt="UofT Space" />
  //       </div>

  //       <div className ="register-form" onSubmit={ handleSubmission }>
  //         <form id="mainForm">
  //           <input id="" placeholder="First Name" type="text" name="firstname" onChange={ handleChange } required/>
  //           <br/>
  //           <input id="" placeholder="Last Name" type="text" name="lastname" onChange={ handleChange } required/>
  //           <br/>
  //           <input id="" placeholder="Phone #" type="text" name="phoneNumber" onChange={ handleChange } required/>
  //           <br/>
  //           <input id="txtEmail" placeholder="Email" type="email" name="email" onChange={ handleChange } required/>
  //           <br/>
  //           <input id="txtPass" placeholder="Password" type="password" name="password" onChange={ handleChange } required/>
  //           <br/>
  //           <input className="login-button grow" id="submit" type="submit" name="submit" value="Register!" />
  //         </form>
  //         <button className="create-account grow" onClick={ toLogin }> Login </button>
  //       </div>
  //     </div>
  //   </div>
  // );
}

function mapStateToProps(state) {
  return {
    client: state.firebase.auth,
    errors: state.firebase.authError,
  };
}

export default connect (mapStateToProps)(Registration);
