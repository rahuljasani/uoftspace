import React, { Component } from "react";
import requireAuth from "../requireAuth";

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

export class PostReviewSuccess extends Component {
    render() {
        return (
            <React.Fragment>
                <div style={styles.form}>
                    <h3>Your review has been posted!</h3>
                </div>
            </React.Fragment>
        );
    }
}

export default requireAuth(PostReviewSuccess);
