import React, { Component } from "react";
import requireAuth from "../requireAuth";

import Rating from '@material-ui/lab/Rating';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import firebase from "../../services/firebase";
import PostReviewSuccess from './PostReviewSuccess';
import Navbar from "../Navbar/Navbar";

import { toast } from "react-toastify";

const styles = {
    button: {
        margin: 15
    },
    form: {
        display: "table",
        margin: "0 auto",
        width: "500px"
    }
}

const db = firebase.firestore();

function storeReview(sellerId, postId, values) {
  const { review, rating } = values;
  const reviewDetails = { review, rating, date: new Date() };

  const user = firebase.auth().currentUser;
  if (user != null) {
    reviewDetails["uid"] = user.uid;
  }
  else {
      console.log("Not logged in");
      return -1;
  }

  // Store post details in firestore database
  const postRef = db.collection('users').doc(sellerId);
  postRef.update({
    reviews: firebase.firestore.FieldValue.arrayUnion(reviewDetails)
  });
  const userRef = db.collection('users').doc(user.uid);
  userRef.update({
    reviewed: firebase.firestore.FieldValue.arrayUnion(postId) // Update posts user has reviewed
  });
}

export class PostReview extends Component {
  constructor(props){
    super(props);
    
    var uid;
    var seller;
    var postId;
    
    if (!this.props.location.state || !this.props.location.state.uid || !this.props.location.state.name || !this.props.location.state.postId){
      this.props.history.push("/home");
    }
    else {
      uid = this.props.location.state.uid;
      seller = this.props.location.state.name;
      postId = this.props.location.state.postId;
    }
    
    
    this.state = {
      review: '',
      rating: 5,
      posted: false,
      uid, // seller uid
      seller,
      postId,
    }	
  }
  
  

  // Handle submit
  handlePostReview = () => {
    const { review, rating } = this.state;
    const values = { review, rating };

    storeReview(this.state.uid, this.state.postId, values);
	
    var totalReviews = 0;
    var oldRating = 0;
    var newRating =  0;
    
    var seller = db.collection('users').doc(this.state.uid).get()
    .then(doc => {
      if(typeof doc.data().totalReviews === 'undefined'){
        totalReviews = 1;
      }
      else{
        totalReviews = parseInt(doc.data().totalReviews) + 1;
      }
      
      if(typeof doc.data().sellingRating === 'undefined'){
        oldRating = 0;
        newRating = parseInt(this.state.rating);
      }
      else{
        oldRating = parseInt(doc.data().sellingRating);
        newRating  = (parseInt(this.state.rating) * (totalReviews - 1)  + oldRating)/totalReviews;
      }
      
      var sellerRef = db.collection('users').doc(this.state.uid);
      
      sellerRef.update(
        {
          sellingRating: newRating,
          totalReviews
        }
      );		
    })
    .catch( (err) => {
      console.log(err);
    });
    

    this.props.history.push("/prevTransaction");
    toast("Your review has been posted!", { type: 'success'});
  }

  // Handle field changes
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar/>

        <div style={styles.form}>
          <h3>Post a review for {this.state.seller}:</h3>
          <h4>Review: </h4>

          <Rating
            name="rating"
            id="rating"
            size="large"
            value={parseInt(this.state.rating)}
            onChange={this.handleChange}
          />
          
          <TextField
            label="Review"
            id="review"
            name="review"
            rows="3"
            variant="outlined"
            rowsMax="5"
            multiline={true}
            value={this.state.review}
            onChange={this.handleChange}
            fullWidth
          />
        </div>

        <div className="time" style={styles.form}>
          <Button variant="contained" color="primary" onClick={() => {this.props.history.goBack();}} style={styles.button}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={this.handlePostReview} style={styles.button}>
              Post Review!
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

export default requireAuth(PostReview);
