import React, { Component } from "react";
import requireAuth from "../requireAuth";
import './PostParkingSpot.css';
import PostTimeDateDetails from './PostParkingSpotTimeDate';
import PostParkingSpotForm from "./PostParkingSpotDetails";
import ConfirmParkingSpot from "./PostParkingSpotConfirm";
import ParkingSpotPosted from "./PostParkingSpotDone";
import Navbar from "../Navbar/Navbar";
import {TimelineMax, Linear, TweenMax, Bounce, Elastic} from "gsap";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";

import axios from 'axios';

const HERE_API_KEY = 'gXuPcVBAQAv3tMyNvuktcTNK1HWZx7Np32GnvC92q1M';

export class PostParkingSpot extends Component {
  state = {
    step: 1,
    title: '',
    address: '',
    addressSuggestions: [],
    description: '',
    price: '',
    campus: '',
    photos: [],
    date: new Date(),
    fromTime: new Date(2020, 0, 1, 9, 0),
    toTime: new Date(2020, 0, 1, 17, 0),
    errors: {
      addressError: '',
      addressErrorText: ''
    },
    posting: false,
    history: this.props.history,
  }

// https://codepen.io/jonathan/pen/gavKab --> for help with GSAP
  componentDidMount(){
    TweenMax.from('.form', 2.5, { ease: Elastic.easeOut.config(1, 0.3), y: -500 });
  }

  // Go to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  }

  // Go to previous step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  }

  posting = (isPosting) => {
    this.setState({
      posting: isPosting
    })
  }

  // Handle field changes
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // Hanlde date change
  handleDateChange = val => {
    this.setState({
      date: val
    });
  }

  // Handle from time change
  handleFromTimeChange = val => {
    this.setState({
      fromTime: val
    });
  }

  // Handle to time change
  handleToTimeChange = val => {
    this.setState({
      toTime: val
    });
  }

  // Handle added images
  handleImagesAdded = e => {
    this.setState({
      photos: [...this.state.photos, e.target.files[0]]
    });
  }

  removeImage = index => {
    const photos = [...this.state.photos];
    photos.splice(index, 1);
    this.setState({
      photos: photos
    });
  }

  handleAddressChange = (e, address) => {
    this.setState({
      address: address
    })
  }

  handleAddressQuery = e => {
    if (!e) return;
    const address = e.target.value;

    if (!(address.length > 3)) {
      this.setState({
        addressSuggestions: []
      })
      return;
    }

    const self = this;
    const addressBox = "43.873676,-79.918426;43.458102,-79.006416"; 
    axios.get('https://geocoder.ls.hereapi.com/6.2/geocode.json',
      {'params': {
        'apiKey': HERE_API_KEY,
        'searchtext': address,
        'maxresults': 3,
        'country': 'CAN',
        'bbox': addressBox
      }}).then(function (response) {
          const suggestions = [];
          if (response.data.Response.View[0]){
            const results = response.data.Response.View[0].Result;
            results.forEach(result => {
              const suggestion = result.Location.Address; 
              suggestion["lat"] = result.Location.DisplayPosition.Latitude;
              suggestion["long"] = result.Location.DisplayPosition.Longitude;
              suggestions.push(suggestion);
            });
            self.setState({
              addressSuggestions: suggestions
            })
          }
      });
  }

  render() {
    const { step } = this.state;
    const { title, address, addressSuggestions, description, price, campus, photos, date, fromTime, toTime, errors, posting, history } = this.state;
    const values = { title, address, addressSuggestions, description, price, campus, photos, date, fromTime, toTime, errors, posting, history };

    var page = null;

    switch (step) {
      case 1:
        page = (
          <PostTimeDateDetails
            nextStep={this.nextStep}
            handleDateChange={this.handleDateChange}
            handleFromTimeChange={this.handleFromTimeChange}
            handleToTimeChange={this.handleToTimeChange}
            values={values}
          />
        );
        break;
      case 2:
        page = (
          <PostParkingSpotForm
            prevStep={this.prevStep}
            nextStep={this.nextStep}
            removeImage={this.removeImage}
            handleChange={this.handleChange}
            handleImagesAdded={this.handleImagesAdded}
            handleAddressChange={this.handleAddressChange}
            handleAddressQuery={this.handleAddressQuery}
            values={values}
          />
        );
        break;
      case 3:
        page = (
          <ConfirmParkingSpot
            prevStep={this.prevStep}
            nextStep={this.nextStep}
            posting={this.posting}
            values={values}
          />
        );
        break;
      case 4:
        page = (<ParkingSpotPosted />);
        break;
    }

    return (
      <div className="post-bg">
        <Navbar />
        {page}
      </div>
    )
  }
}

export default requireAuth(PostParkingSpot);
