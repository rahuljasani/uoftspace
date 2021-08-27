import React, { Component } from "react";
import { withRouter } from 'react-router';
import requireAuth from "./requireAuth";
import './index.css';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import firebase from "../services/firebase";
import MuiPhoneNumber from 'material-ui-phone-number';
import Navbar from "../components/Navbar/Navbar"
import {TimelineMax, Linear, TweenMax, Bounce, Elastic, SlowMo, Power0} from "gsap";


const styles = {
  button: {
      margin: 15,
  },
  profilePhotoSize: {
    width: "200px",
    height: "200px"
  }
}

export class Profile extends Component {

  state = {
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    avatarUrl: "",
    profileChange: false
  }

  photo = null;

  // https://codepen.io/jonathan/pen/gavKab --> for help with GSAP framework

  componentDidMount(){
    TweenMax.from('.profile-container', 5.5, { ease: Elastic.easeOut.config(1, 0.2), y: -170 });
    TweenMax.to('.profile-form', 2.5, { ease: Power0.easeNone, y: -130 });

    var state = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user != null) {
        firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then(doc => {
              state.setState(doc.data());
          })
          .catch(function(error) {
              console.log("Error getting user from firestore: ", error);
          });
      }
    });
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handlePhoneNumChange = val => {
    this.setState({
      phoneNumber: val
    })
  }

  handleUpdate = e => {
    const user = firebase.auth().currentUser;
    if (user != null) {
      const db = firebase.firestore();
      const userRef = db.collection('users').doc(user.uid);
      userRef.set(this.state);
      this.props.history.push('/home');
    }
    else {
      console.log("Not logged in");
      return -1;
    }
  }

  uploadPhoto = e => {
    const user = firebase.auth().currentUser;
    if (user != null) {
      const photoStorageRef = firebase.storage().ref().child('profilePhotos').child(user.uid).child(this.photo.name);
      const uploadTask = photoStorageRef.put(this.photo);
      const state = this;
      uploadTask.on('state_changed',
        function(snapshot){
          // Progress
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              // console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING:
              // console.log('Upload is running');
              break;
          }
        },
        function(error){
          // Unsuccessful Upload
          console.log("Upload error");
          return -1;
        },
        function() {
          // Successful Photo Upload, store avatarUrl in state and update db
          uploadTask.snapshot.ref.getDownloadURL().then(async function(downloadURL) {
            await user.updateProfile({
              photoURL: downloadURL
            });
            state.setState({
              avatarUrl: downloadURL,
              profileChange: false
            });
            const db = firebase.firestore();
            const userRef = db.collection('users').doc(user.uid);
            userRef.set(state.state);
           firebase.auth().updateCurrentUser(user).then(()=>{
             console.log("Done")
           }).catch((err) => {
             console.log(err)
           });
          });
        }
      );
    }
  }

  handleNewPhoto = e => {
    this.photo = e.target.files[0];
    // change the loading style around it
    this.setState({ profileChange: true });
    this.uploadPhoto();
    // console.log(this.state.profileChange);
  }

  render() {
    return (
      <div className="profile-bg">
        <Navbar />
          <div className="page-center profile-center">

            <div className={this.state.profileChange ? 'updating-colour': 'profile-container'}>
              <input accept="image/*" id="icon-button-file" type="file" onChange={this.handleNewPhoto} hidden/>
                <label htmlFor="icon-button-file">
                  <IconButton color="primary" component="span">
                    <Avatar alt="Profile picture" src={this.state.avatarUrl} style={styles.profilePhotoSize}/>
                  </IconButton>
                </label>
            </div>

            <div className="profile-form">
              <Grid container direction="column" spacing={2}>
                <Grid item container direction="row" spacing={1} alignItems="center">
                  <Grid item xs>
                    <TextField
                      autoComplete="fname"
                      label="First Name"
                      name="firstname"
                      id="firstname"
                      variant="outlined"
                      value={this.state.firstname}
                      onChange={this.handleChange}
                      fullWidth
                      autoFocus
                      required
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="Last Name"
                      name="lastname"
                      id="lastname"
                      variant="outlined"
                      value={this.state.lastname}
                      onChange={this.handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>


                <Grid item>
                  <TextField
                    label="Email"
                    name="email"
                    id="email"
                    variant="outlined"
                    value={this.state.email}
                    onChange={this.handleChange}
                    disabled
                    fullWidth
                  />
                </Grid>

                <Grid item>
                  <MuiPhoneNumber
                    defaultCountry='ca'
                    onlyCountries={['ca']}
                    onChange={this.handlePhoneNumChange}
                    variant="outlined"
                    fullWidth
                    required
                    value={this.state.phoneNumber}
                  />
                </Grid>

                <Grid item container direction="row" spacing={1} alignItems="center">
                  <Grid item xs>
                    <TextField
                      autoComplete="fname"
                      label="PayPal Mercant ID"
                      name="paypalMerchantSvp"
                      id="firstname"
                      variant="outlined"
                      value="ZPN29UHVBDNW6"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      autoComplete="fname"
                      label="Stripe Mercant ID"
                      name="stripeMerchantSvp"
                      id="firstname"
                      variant="outlined"
                      value="sk_test_a2tEhDvXIGjIzTZnboxshnCG00oGnw77x6"
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>

                <Grid item container direction="row" justify="space-between">
                  <Button variant="contained" color="primary" onClick={() => {this.props.history.goBack();}} style={styles.button}>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" onClick={this.handleUpdate} style={styles.button}>
                    Update
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
      </div>
    )
  }
}

export default withRouter(requireAuth(Profile));
