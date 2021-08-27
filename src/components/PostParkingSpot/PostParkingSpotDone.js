import React, { Component } from "react";
import requireAuth from "../requireAuth";
import './PostParkingSpot.css';

export class ParkingSpotPosted extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="form">
                    <h3>Your parking spot has been posted!</h3>
                </div>
            </React.Fragment>
        );
    }
}

export default requireAuth(ParkingSpotPosted);
