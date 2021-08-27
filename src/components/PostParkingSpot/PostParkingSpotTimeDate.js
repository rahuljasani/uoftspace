import React, { Component } from "react";
import requireAuth from "../requireAuth";
import './PostParkingSpot.css';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from "@date-io/date-fns";

import {
    KeyboardDatePicker,
    KeyboardTimePicker,
    MuiPickersUtilsProvider
} from "@material-ui/pickers";

const styles = {
    button: {
        margin: 15
    },
    time: {
        padding: 10
    }
}

export class PostTimeDateDetails extends Component {

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    render() {
        const { values, handleDateChange, handleFromTimeChange, handleToTimeChange} = this.props;
        return (
            <React.Fragment>
                <div className="form">
                    <h3>Select the date and timings for your posting:</h3>
                    
                    <MuiPickersUtilsProvider className="break" utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            disablePast
                            name="date"
                            format="MM/dd/yyyy"
                            margin="normal"
                            label="Select the date"
                            onChange={handleDateChange}
                            value={values.date}
                        />

                        <Grid container direction="row" justify="space-between">
                            <Grid item>
                                <KeyboardTimePicker
                                    name="fromTime"
                                    label="From"
                                    margin="normal"
                                    value={values.fromTime}
                                    onChange={handleFromTimeChange}
                                    minutesStep={10}
                                />
                            </Grid>
                            <Grid item>
                                <KeyboardTimePicker
                                    name="toTime"
                                    label="To"
                                    margin="normal"
                                    value={values.toTime}
                                    onChange={handleToTimeChange}
                                    minutesStep={10}
                                />
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>

                    <div className="break">
                        <Button variant="contained" color="primary" onClick={this.continue} style={styles.button}>
                            Next
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default requireAuth(PostTimeDateDetails);
