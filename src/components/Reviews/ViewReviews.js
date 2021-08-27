import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router';
import requireAuth from "../requireAuth";
import { useHistory } from "react-router-dom";
import './review.css';

import Rating from '@material-ui/lab/Rating';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import Navbar from "../Navbar/Navbar";

import firebase from "../../services/firebase";

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

const ViewReviews = (props) => {
    const { match: { params } } = props;
    
    const history = useHistory();
    const [state, setState] = useState({
        uid: params.uid,
        name: "",
        reviews: [],
        orderedBy: "date"
    });
    
    useEffect(() => {
        let db = firebase.firestore();
        
        const firebaseToState = async () => {
            let userDoc = await db.collection('users').doc(state.uid).get()

            var reviews = [];
            if(typeof userDoc.get("reviews") !== 'undefined')
                reviews = userDoc.get("reviews");

            let name = userDoc.get("firstname");

            setState({reviews, name});
        }
        firebaseToState();
    }, []);

    return (
        <React.Fragment>
            <Navbar />

            <div style={styles.form}>
                <h2>Reviews for {state.name}:</h2>

                {/* {state.orderedBy === "date" ? (
                    <div className="space">
                        <h4>Ordered by date:</h4>
                        <Button variant="contained" color="primary" onClick={() => this.getReviews("overallReview")} style={styles.button}>
                            Order by rating
                        </Button>
                    </div>
                ) : (
                    <div className="space">
                        <h4>Ordered by overall rating: </h4>
                        <Button variant="contained" color="primary" onClick={() => this.getReviews("date")} style={styles.button}>
                            Order by date
                        </Button>
                    </div>
                )} */}

                {state.reviews.length == 0 && <h3>No reviews</h3>}

                {state.reviews.map((review, index)=>(
                    <div key={index}>
                        <Card variant="outlined">
                            <CardContent>
                                <Rating value={parseInt(review.rating)} size="large" readOnly />
                                <h5>{review.review}</h5>
                            </CardContent>
                        </Card>
                    </div>
                ))}

                <div style={{textAlign: "center"}}>
                    <Button variant="contained" color="primary" onClick={() => {history.goBack();}} style={styles.button}>
                        Back
                    </Button>
                </div>
                
            </div>
        </React.Fragment>
    )
}

export default requireAuth(ViewReviews);
