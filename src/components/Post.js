import React, { Component  } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import requireAuth from "./requireAuth";
import './index.css';
import Navbar from "./Navbar/Navbar"
import Rating from "@material-ui/lab/Rating";
import {Typography} from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import firebase from "../services/firebase";
import {TimelineMax, Linear, TweenMax, Bounce, Elastic, SlowMo, Power0} from "gsap";
import { useHistory } from "react-router-dom";
import Payment from "./Payment/Payment"
import { PAY_ERROR, PAY_SUCCESS, PAY_IN_PROGRESS } from "../actions/actionTypes";

const styles = {
  button: {
      margin: 15,
  },
  profilePhotoSize: {
    width: "250px",
    height: "250px"
  }
}

const db = firebase.firestore();

export class Post extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      postId: props.match.params.uid,
      post: null,
      reserved: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.payStatus === PAY_SUCCESS && prevProps.payStatus !== PAY_SUCCESS) {
      this.props.history.push("/PrevTransaction");
    }
  }

  getPost = async () => {
    let post = await db.collection('posts').doc(this.state.postId).get();
    post = post.data();
    
    post.date = new Date(post.date.seconds * 1000);
    post.fromTime = new Date(post.fromTime.seconds * 1000);
    post.toTime = new Date(post.toTime.seconds * 1000);
    post.postId = this.state.postId;
    
    this.setState({
      post: post
    })
  }

  render() {

    this.getPost();

    return (
      <React.Fragment>
          <Navbar />

          <br/>
          <br/>

          {this.state.post ? (
          
          <div style={{textAlign: "center"}}>
          
            <Typography gutterBottom variant="h3">
              Order Summary:
            </Typography>

            <Typography gutterBottom variant="h5">
              {this.state.post.title}
            </Typography>

            <Typography gutterBottom variant="h5">
              <a href={"https://www.google.com/maps/dir/current+location/" + this.state.post.address} target="_blank">{this.state.post.address}</a>
            </Typography>

            <Typography gutterBottom variant="body1">
              Posted by: <a href={"/profile/" + this.state.post.uid}>{this.state.post.poster}</a> <Rating value={this.state.post.rating} readOnly />
            </Typography>
            
            <Typography gutterBottom variant="body1">
              Price: ${this.state.post.price} per hour
            </Typography>
            
            <Typography gutterBottom variant="body1">
              Available on {this.state.post.date.toLocaleDateString("en-US", 
              { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>

            <Typography gutterBottom variant="body1">
              From {this.state.post.fromTime.toLocaleTimeString("en-US", 
              { hour: 'numeric', minute: 'numeric'})} to {this.state.post.toTime.toLocaleTimeString("en-US", 
              { hour: 'numeric', minute: 'numeric'})}
            </Typography>

            <div><img src={this.state.post.photos[0]} width="300" height="300" alt="image"/></div>

            <Typography gutterBottom variant="body1">
              Description: {this.state.post.description}
            </Typography>
            
            <Typography gutterBottom variant="h5">
              Total: ${this.state.post.price * (Math.abs(this.state.post.toTime - this.state.post.fromTime) / 36e5)}
            </Typography>

            <Grid container>
              <Grid item xs>
                <Button variant="contained" color="primary" onClick={() => {this.props.history.goBack();}}>
                  Back
                </Button>
              </Grid>
              <Grid item xs>
                <Payment 
                  cost={this.state.post.price * (Math.abs(this.state.post.toTime - this.state.post.fromTime) / 36e5)}
                  post={this.state.post}
                />
              </Grid>
            </Grid>
          </div>
          ) : (
            <div>No posting</div>
          )}
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
      payStatus: state.reducers.payReducer.payVer,
  };
}

export default connect(mapStateToProps)(withRouter(requireAuth(Post)));