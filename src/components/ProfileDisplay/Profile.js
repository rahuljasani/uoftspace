import React, { useState, useEffect  } from "react";
import { withRouter } from 'react-router';
import requireAuth from "../requireAuth";
import '../index.css';
import Navbar from "../Navbar/Navbar"
import Rating from "@material-ui/lab/Rating";
import {Box, Typography} from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import firebase from "../../services/firebase";
import {TimelineMax, Linear, TweenMax, Bounce, Elastic, SlowMo, Power0} from "gsap";
import { useHistory } from "react-router-dom";

const styles = {
  button: {
      margin: 15,
  },
  profilePhotoSize: {
    width: "250px",
    height: "250px"
  }
}

const Profile = (props) => {
  const { match: { params } } = props;
  
  const history = useHistory()
  const [state, setState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    avatarUrl: "",
    rating: 0,
    uid: ""
  })

  const handleClick = (e) => {
    history.push("/chat/"+state.uid)
  }

  // https://codepen.io/jonathan/pen/gavKab --> for help with GSAP framework

  useEffect(() => {
    

    let db = firebase.firestore()
    TweenMax.from('.profile-container', 5.5, { ease: Elastic.easeOut.config(1, 0.2), y: -170 });
    TweenMax.to('.profile-form', 2.5, { ease: Power0.easeNone, y: -130 });
    
    const firebaseToState = async () => {
      let query = await db.collection('users').doc(params.uid).get()
      let data = query.data();
      let image = "https://i.imgur.com/b08hxPY.png";
      if (data.avatarUrl == undefined){
          data.avatarUrl = image;
      }

      data.uid = params.uid;
      data.rating = data.sellingRating;
      setState(data);
    }
    firebaseToState()
  }, [])

  return (
    <div className="profile-bg">
        <Navbar />
        <div className="page-center profile-center">

          <Avatar alt="Profile picture" src={state.avatarUrl} style={styles.profilePhotoSize}/>
          
          <div className="profile-form">
            <Grid container direction="column">
              <Grid item style={{textAlign: "center"}}>
                <h2>{state.firstname} {state.lastname}</h2>
                <h4>{state.email}</h4>
              </Grid>
              <Grid item container direction="row" justify="space-evenly">
                <Grid item>
                  <Typography component="legend">Seller Rating</Typography>
                  <Rating name="read-only" value={state.rating} readOnly />
                </Grid>

                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => history.push("/reviews/" + state.uid)} style={styles.button}> Reviews </Button>
                </Grid>

                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleClick} style={styles.button}> Message </Button>
                </Grid>
              </Grid>

              <Grid item container direction="row" justify="center">
                <Button variant="contained" color="primary" onClick={() => {history.goBack();}} style={styles.button}>
                  Back
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
    </div>
  )
}

export default withRouter(requireAuth(Profile));
