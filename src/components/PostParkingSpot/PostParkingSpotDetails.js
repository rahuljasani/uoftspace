import React, { Component } from "react";
import requireAuth from "../requireAuth";
import './PostParkingSpot.css';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
    button: {
        margin: 15
    }
}

export class PostParkingSpotForm extends Component {
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    removeImage = index => e => {
        e.preventDefault();
        this.props.removeImage(index);
    }

    render() {
        const { values, handleChange, handleImagesAdded, handleAddressChange, handleAddressQuery} = this.props;

        return (
            <React.Fragment>
                <div className="form">
                    <h3>Enter the Parking Spot Details:</h3>

                    <div>
                        <TextField
                            label="Title"
                            name="title"
                            id="title"
                            fullWidth
                            value={values.title}
                            onChange={handleChange}
                        />
                    </div>
          
                    <div className="break space">
                        <TextField
                            label="Price"
                            name="price"
                            id="price"
                            value={values.price}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                endAdornment: <InputAdornment position="end">per hour</InputAdornment>
                            }}
                        />
                        
                        <TextField select name="campus" label="Campus" value={values.campus} onChange={handleChange} style={{width: 100}}>
                            <MenuItem value={"UTM"}>UTM</MenuItem>
                            <MenuItem value={"UTSG"}>UTSG</MenuItem>
                            <MenuItem value={"UTSC"}>UTSC</MenuItem>
                        </TextField>
                    </div>

                    <div className="break">
                        <form noValidate>
                            <Autocomplete
                                options={values.addressSuggestions}
                                getOptionLabel={option => option.Label}
                                onInputChange={handleAddressQuery}
                                onChange={handleAddressChange}
                                filterOptions={options => options}
                                defaultValue={values.address !== "" ? values.address : null}
                                disableClearable
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Address"
                                        name="address"
                                        id="address"
                                        error={values.errors.addressError !== ''}
                                        helperText={values.errors.addressErrorText}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        </form>
                        
                    </div>

                    <div className="break">
                        <TextField
                            label="Description"
                            name="description"
                            id="description"
                            multiline
                            fullWidth
                            rows={3}
                            rowsMax={5}
                            variant="outlined"
                            value={values.description}
                            onChange={handleChange}
                        />
                    </div>

                    {values.photos.length < 3 &&
                        <div className="break">
                            <Button name="photos" variant="contained" component="label">
                                Add photo
                                <input type="file" multiple={false} accept="image/*" onChange={handleImagesAdded} className="hide"/>
                            </Button>
                        </div>
                    }
          
                    <div className="break">
                        <Grid container alignItems="baseline" spacing={3}>
                            {values.photos && [...values.photos].map((file, index)=>(
                                <Grid key={index} item xs={4}>
                                    <div>
                                        <img src={URL.createObjectURL(file)} multiple={true} />
                                        <br/>
                                        <br/>
                                        <Button fullWidth variant="contained" color="primary" onClick={this.removeImage(index)}>
                                            Remove image
                                        </Button>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </div>

                    <div className="space break">
                        <Button variant="contained" color="primary" onClick={this.back} style={styles.button}>
                            Back
                        </Button>

                        <Button variant="contained" color="primary" onClick={this.continue} style={styles.button}>
                            Next
                        </Button>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}

export default requireAuth(PostParkingSpotForm);
