import React, { Component } from "react";
import requireAuth from "../requireAuth";
import './PostParkingSpot.css';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { format } from "date-fns";
import { toast } from "react-toastify";

import firebase from "../../services/firebase";


const styles = {
    button: {
        margin: 15
    }
}



export class ConfirmParkingSpot extends Component {

    continue = e => {
        e.preventDefault();

        this.props.posting(true);

        var thisVar = this;

        // Submit form info to backend here
        this.storePost(this.props.values);
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    storePost = values => {
        const { title, address, description, price, photos, date, fromTime, toTime, history } = values;
    
        const postDetails = { title, address: address.Label, location: new firebase.firestore.GeoPoint(address.lat, address.long), description, price, date, fromTime, toTime };
        postDetails["photos"] = [];
        postDetails["booked"] = false;
        postDetails["bookedBy"] = "";
    
        const user = firebase.auth().currentUser;
        const userRef = firebase.firestore().collection('users').doc(user.uid);
        const db = firebase.firestore();
        var postHistory;
        var thisVar = this;
        if (user != null) {
            postDetails["uid"] = user.uid;
            var poster = db.collection('users').doc(user.uid).get()
            .then(doc => {
                poster = doc.data().firstname;
                postHistory = doc.data().posted; 
                postDetails["poster"] = poster;
                if(typeof doc.data().sellingRating === 'undefined'){
                    postDetails["rating"] = 0;
                }
                else{
                    postDetails["rating"] = doc.data().sellingRating;
                }
            })
            .then(() => {
                // Store post details in firestore database
                const postRef = db.collection('posts').doc();
                postRef.set(postDetails);
    
                const postKey = postRef.id;
                
                
                if (!postHistory) postHistory = []; 
                postHistory.push(postKey)
                userRef.update({
                  posted: postHistory,
                });
    
                // Upload photos to firebase storage
                const photosStorageRef = firebase.storage().ref().child('posts/' + postKey);
    
                photos.forEach(photo => {
                    const photoStorageRef = photosStorageRef.child(photo.name);
                    const uploadTask = photoStorageRef.put(photo);
    
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
                            // console.log("Upload error");
                            return -1;
                        },
                        function() {
                            // Successful Photo Upload, add download link to post details
                            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                                postRef.update({
                                    photos: firebase.firestore.FieldValue.arrayUnion(downloadURL)
                                });
                                // console.log('File available at', downloadURL);
                            });
    
                            thisVar.props.posting(false);
                            history.goBack();
                            toast("Your parking spot has been posted!", { type: 'success'});
                        }
                    );
                });
            })
            .catch(err => {
                console.log("error getting user from firestore", err);
            });
            
          
            
        }
        else {
            console.log("Not logged in");
            return -1;
        }
    }

    render() {
        const { title, address, description, price, campus, date, fromTime, toTime, photos, posting } = this.props.values;
        
        return (
            <React.Fragment>
                <div className="form">
                    <h3>Confirm the Parking Spot</h3>

                    <div className="break">
                        <Grid container direction="column" spacing={2}>
                            <Grid container alignItems="baseline" direction="row" spacing={3}>
                                {photos && [...photos].map((file, index)=>(
                                    <Grid key={index} item xs={4}>
                                        <img src={URL.createObjectURL(file)}/>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid item xs={9} container direction="column" spacing={2}>
                                    <Typography gutterBottom variant="h5">
                                        {title}
                                    </Typography>
                                    <Typography gutterBottom variant="body1">
                                        {format(date, "MMMM dd, yyyy")} - {format(fromTime, "h:mm a")} to {format(toTime, "h:mm a")}
                                    </Typography>
                                    <Typography  variant="body1">
                                        {address.Label}
                                    </Typography>
                                    <Typography gutterBottom variant="body2" className="whitespace-wrap">
                                        {description}
                                    </Typography>
                                </Grid>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Typography variant="h5" align="right">
                                        ${price} / hour
                                    </Typography>
                                    <Typography variant="h6" align="right">
                                        {campus}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item container direction="row" justify="space-between">
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={this.back} style={styles.button}>
                                        Back
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={this.continue} style={styles.button}>
                                        Confirm & Post Parking Spot
                                    </Button>
                                </Grid>
                            </Grid>
                            {posting && (
                                <Grid item container direction="row" justify="flex-end">
                                    <CircularProgress />
                                </Grid>
                            )}
                        </Grid>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default requireAuth(ConfirmParkingSpot);
