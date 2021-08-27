import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {TWITTER, GOOGLE} from "../../actions/actionTypes";
import { useHistory } from "react-router-dom";
import '../index.css'
import NavbarCustom from '../Navbar/Navbar';
import "react-toastify/dist/ReactToastify.css";
import { useFirebase } from 'react-redux-firebase'
import logo from '../Assets/uoft-logo.png';
import twitter from '../Assets/twitter.png';
import gmail from '../Assets/gmail.png';
import clouds from '../Assets/clouds.jpg';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CustomIcon } from '../CustomIcons/CustomIcon';
import Twitter from '@material-ui/icons/Twitter';

import { toast } from "react-toastify";
import { Divider } from "material-ui";
toast.configure();

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${clouds})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = ({client, errors}) => {
  // TODO: Seperate the forum from the syling aspects
  const fb = useFirebase(); 
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const history = useHistory()
  const classes = useStyles();

  // As the field changes update our state
  const handleChange = (e) => {
    e.persist();
    setCredentials({
      ...credentials,
      [e.target.name] : e.target.value
    });
  }

  const handleLoginSubmission = (e) => {
    // Prevents resubmission
    e.preventDefault();
    //TODO: The path is temp, can route this later once we decide on one
    setCredentials({
      email: credentials.email,
      password: credentials.password,
    });
    
    login(credentials)

    // Reset the state
    setCredentials({
      email: "",
      password: ""
    });

  }

  const handleThirdPatySubmission = (e) => {
    loginThirdParty({ provider: e.currentTarget.id, type: 'popup' });
  }

  const login = async (method) => {
    try { await fb.login(method); }
    catch (error) { console.log(error) }
  }

  const loginThirdParty = async (method) => {
    try { 
      let cred = await fb.login(method); 
      if (cred.additionalUserInfo.isNewUser)
        history.push("/profile");
      else
        history.push("/home");
    } 
    catch (error) { console.log(error) }
  }

    // Check for errors 
    useEffect(() => {
      if (client.emailVerified) {
        history.push("/home");
      }
    }, [client]);

  // Check for errors 
  useEffect(() => {
    if (errors.length === 0) return 
    else if (errors[errors.length - 1]){
      toast(errors[errors.length - 1].code.split("/")[1], { type: 'error'}); 
      errors.pop(); 
    } 
  }, [errors, client.emailVerified]);

  // Notify client if they need to verify email  
  useEffect(() => {
    console.log(client)
    if (client.isEmpty) return
    if (!client.emailVerified){ toast("Please verify your email", { type: 'error'}); fb.logout(); return; } 
  }, [client.emailVerified]);

  return (
    <Grid container component="main" className={classes.root}>
    <CssBaseline />
    <Grid item xs={false} sm={4} md={7} className={classes.image}>
    <div className="center-login-logo" >
        <div className = "UofT-Space">
          <img className="logo" src={logo} alt="UofT Space" />
        </div>
    </div>
    </Grid>
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={ handleLoginSubmission } noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={ handleChange }
            id="email"
            label="Email Address"
            name="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={ handleChange }
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onSubmit={ handleLoginSubmission }
          >
            Sign In
          </Button>
        </form>
        <Grid container>
            <Grid item>
              <Link href="/registeration" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Grid container spacing={0}>
            <Grid container item xs={12} spacing={0}>
              <Grid item xs={5}>
                <hr className="horizontal-bars"/>
              </Grid>
              <Grid item xs={2}>
                <center>
                <Typography variant="body2" > OR SIGN IN WITH</Typography>
                </center>
              </Grid>
              <Grid item xs={5}>
                <hr className="horizontal-bars"/>
              </Grid>
            </Grid>
          </Grid>
        <Grid container alignContent="flex-end" spacing={0}>
            <Grid container item xs={12} spacing={0}>
            <Grid item xs={5}>
            </Grid>
              <Grid item xs={1} >
                <div style={{height: 80}} >
                  <a href="#" id={ GOOGLE } onClick= { handleThirdPatySubmission }><CustomIcon icon={gmail} /></a>
                </div>
              </Grid>
              <Grid item xs={1}>
                <a href="#" id={ TWITTER } onClick= { handleThirdPatySubmission }> <Twitter color="primary" style={{ fontSize: 80 }} /></a>
              </Grid>
              <Grid item xs={5}>
            </Grid>
            </Grid>
          </Grid>
      </div>
    </Grid>
  </Grid>
  );
}

function mapStateToProps(state) {
  return {
    client: state.firebase.auth,
    errors: state.firebase.errors
  };
}

export default connect (mapStateToProps)(Login);
