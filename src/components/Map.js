import React, { Component } from "react";
import { connect } from "react-redux";
import requireAuth from "./requireAuth";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import firebase from "../services/firebase";
import userIcon from './Assets/parking-user.png';
import publicIcon from './Assets/parking-public.png';
import Typography from '@material-ui/core/Typography';
import { Button } from "@material-ui/core";
import ReactDOM from "react-dom";
import Rating from '@material-ui/lab/Rating';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Collapsible from 'react-collapsible';
import TextField from "@material-ui/core/TextField";
import Payment from "./Payment/Payment"
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import DateFnsUtils from "@date-io/date-fns";
import { format, isValid } from "date-fns";
import { PAY_ERROR, PAY_SUCCESS, PAY_IN_PROGRESS } from "../actions/actionTypes";

import {
    KeyboardDatePicker,
    KeyboardTimePicker,
    MuiPickersUtilsProvider
} from "@material-ui/pickers";

import Navbar from "./Navbar/Navbar";

var globalMapProps;
var globalMap;
const db = firebase.firestore();


const mapStyle = [
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "on"
      }
    ]
  },
  {
    featureType: "all",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "on"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "on"
      }
    ]
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [
      {
        visibility: "on"
      }
    ]
  },
  {
    elementType: "geometry",
    stylers: [
      {
        width: "50%"
      }
    ]
  },
  
];

const mapStyles = { 
  width: '100%', 
  height: '93%',
  bottom: "0",
  top: "5%",
  position: "absolute",
};

const selectStyle = {
  backgroundColor: "rgb(242, 254, 255)",
  textAlign: 'center',
  margin: 10
}



export class MapContainer extends Component {
  constructor(props) {
    super(props);

    // console.log("props are:");

    // default value
    var campusName = "utm";
    var location = {lat: 43.548766, lng: -79.663292}

    if(this.props.location.state.campus == "utsc"){
      campusName = "utsc";
      location = {lat: 43.7839, lng: -79.1874};
    }

    else if(this.props.location.state.campus == "utsg") {
      campusName = "utsg";
      location = {lat: 43.6629, lng: -79.3957};
    }

    this.state = {
    showingInfoWindow: false,  
    activeMarker: {},         
    selectedPlace: {},
    campus: location,
    campusName: campusName,
    request: null,
    zoom: 15.25,
    result: [],
    posts: [],
    priceRange: [0, 100],
    filterFromTime: {},
    filterToTime: {},
    filterFromTimeMui: null,
    filterToTimeMui: null,
	filterDate: null,
	reserved: null,
    };
  }
  
  sellerRating = (uid) => {
	  async function getRating(uid){
		var userRef = await firebase.firestore().collection('users').doc(uid).get();

		if (typeof userRef.get("sellingRating") !== "undefined"){
			return userRef.get("sellingRating");
		}
	  }
	  return getRating(uid);
   }

  

  fetchPlaces = (mapProps, map) => {
    globalMap = map;
    globalMapProps = mapProps;
    
    const {google} = mapProps;
    const service = new google.maps.places.PlacesService(map);
    
    this.state.request = {
      location: this.state.campus,
      radius: '1000',
      type: ['parking']
    };
  
  
    this.state.callback = (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK){
        this.setState({result: results});
      }
    };
    
    service.nearbySearch(this.state.request, this.state.callback);
    
    var thisVar = this;
	  var f = this.sellerRating;
    db.collection('posts').get().then(function(doc) {
      var userPosts = [];
      var state = thisVar.state;
      for(var i = 0; i < doc.docs.length; i++) {
        var post = doc.docs[i].data();
        
        const user = firebase.auth().currentUser;
        if (user) {
          if (post.uid == user.uid)
            continue;
        }
        
        post.postId = doc.docs[i].id;
        var price = parseInt(post.price);
        if(state.priceRange[0] != null  && state.priceRange[1] != null && (price < state.priceRange[0] || price > state.priceRange[1])) {
          continue;
        }
        post.date = new Date(post.date.seconds * 1000);
        post.fromTime = new Date(post.fromTime.seconds * 1000);
        post.toTime = new Date(post.toTime.seconds * 1000);
		
        var passDate = false;
        
        if(state.filterDate == null){
          passDate = true;
        }
        else{		
          var postDate = post.date;
          var filterDate = state.filterDate;
          
          postDate.setHours(0,0,0,0);
          filterDate.setHours(0,0,0,0);
        }
          
        (async () => {
          post.rating  = await f(post.uid);
        })();


        var passTime = false;
        var len1 = Object.keys(state.filterFromTime).length
        var len2 = Object.keys(state.filterToTime).length

        if(len1 == 0 || len2 == 0) {
          passTime = true;
        }

        else {
          var filterFromTime = new Date(post.fromTime);
          var filterToTime = new Date(post.toTime);

          var stateFromTime = state.filterFromTime;
          var stateToTime = state.filterToTime;

          filterFromTime.setHours(stateFromTime["hours"], stateFromTime["minutes"], 0, 0);
          filterToTime.setHours(stateToTime["hours"], stateToTime["minutes"], 0, 0);
          
          passTime = (post.fromTime.getTime() == filterFromTime.getTime()) && (post.toTime.getTime() == filterToTime.getTime()); 
        }
    		if(!post.booked && (passDate || filterDate.getTime() === postDate.getTime()) && passTime){
    			userPosts.push(post);
    		}
      }
      thisVar.setState({posts: userPosts});
    });
  };
  

  
  onMarkerClick = (props, marker, e) => {
    // globalMap.setZoom(this.state.zoom - 0.76);
	if(this.state.reserved == null){
		this.setState({
		  selectedPlace: props,
		  activeMarker: marker,
		  showingInfoWindow: true
		});
	}
  };

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
      globalMap.setCenter(this.state.campus);
      // globalMap.setZoom(this.state.zoom);
    }
  };

  reserve = () => {
    this.props.history.push('/post/' + this.state.selectedPlace.post.postId);
  };
  
  
  cancel = () => {
	var state  = this.state;
    this.setState({
	  reserved: null,
      showingInfoWindow: false,
      activeMarker: null,
    });
	globalMap.setCenter(this.state.campus);
	
  };

  changeCampus = event =>{
    

    if(event.target.value == "utm") {
      this.setState({campus: { lat: 43.548766, lng: -79.663292}, campusName: "utm"}, () => {this.fetchPlaces(globalMapProps, globalMap)});
    }

    else if (event.target.value == "utsc") {
      this.setState({campus: {lat: 43.7839, lng: -79.1874}, campusName: "utsc"}, () => {this.fetchPlaces(globalMapProps, globalMap)});
      
    }

    else if (event.target.value == "utsg") {
      this.setState({campus: {lat: 43.6629, lng: -79.3957}, campusName: "utsg"}, () => {this.fetchPlaces(globalMapProps, globalMap)});
    }
  }
  
  createMarker = () => {
    for (var i = 0; i < this.state.result.length; i++){
      console.log("test"); 
    }
  }

  onInfoWindowOpen = (props, e) => {  
	var window;
    if (typeof this.state.selectedPlace.post !== 'undefined') {
        window = (
          <React.Fragment>
            <Typography gutterBottom variant="h3">
              {this.state.selectedPlace.post.title}
            </Typography>

            <Typography gutterBottom variant="h5">
              <a href={"https://www.google.com/maps/dir/current+location/" + this.state.selectedPlace.post.address} target="_blank">{this.state.selectedPlace.post.address}</a>
            </Typography>
			
			      <Typography gutterBottom variant="body1">
              Posted by: <a href={"/profile/" + this.state.selectedPlace.post.uid}>{this.state.selectedPlace.post.poster}</a> <Rating value={this.state.selectedPlace.post.rating} readOnly />
            </Typography>
			
			      <Typography gutterBottom variant="body1">
              Price: ${this.state.selectedPlace.post.price} per hour
            </Typography>
            
            <Typography gutterBottom variant="body1">
              Available on {this.state.selectedPlace.post.date.toLocaleDateString("en-US", 
              { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>

            <Typography gutterBottom variant="body1">
              From {this.state.selectedPlace.post.fromTime.toLocaleTimeString("en-US", 
              { hour: 'numeric', minute: 'numeric'})} to {this.state.selectedPlace.post.toTime.toLocaleTimeString("en-US", 
              { hour: 'numeric', minute: 'numeric'})}
            </Typography>

            <div><img src={this.state.selectedPlace.post.photos[0]} width="300" height="300" alt="image"/></div>

            <Typography gutterBottom variant="body1">
              Description: {this.state.selectedPlace.post.description}
            </Typography>
			
			<Typography gutterBottom variant="h5">
              Total: ${this.state.selectedPlace.post.price * (Math.abs(this.state.selectedPlace.post.toTime - this.state.selectedPlace.post.fromTime) / 36e5)}
            </Typography>
			
            <Button variant="contained" color="primary" onClick={this.reserve}>
              Reserve
            </Button>
			
          </React.Fragment>
        )
      } 
      else if (typeof this.state.selectedPlace.name !== 'undefined') {
        window = (
          <div>
            <h3>{this.state.selectedPlace.name}</h3>
            <p>Public parking spot</p>
          </div>
        )
      } 
      else {
        window = (
          <div>Undefined</div>
        )
      }
    ReactDOM.render(React.Children.only(window), document.getElementById("reserveButton"));
  }
  
  // changePrice = event => {
  //   var fromPrice = event.target.value;//document.getElementById("fromPrice").value;
  //   var toPrice = document.getElementById("toPrice").value;
	// console.log("from " + fromPrice);
	// console.log("to " + toPrice);
  //   if(fromPrice == "None" || toPrice == "None") {
  //     return;
  //   }

  //   this.setState({priceRange: [parseInt(fromPrice), parseInt(toPrice)]}, () => {this.fetchPlaces(globalMapProps, globalMap)});
  // }
  
  handleDateChange = val => {
    var date;
    if (val === null || !isValid(val)){
      date = null;
    } 
    else {
      var dateStr = format(val, "yyyy-MM-dd");
      var date = new Date(dateStr);
      date = new Date( date.getTime() - date.getTimezoneOffset() * -60000 )
    }
  	this.setState({
  		filterDate: date
  	}, () => {this.fetchPlaces(globalMapProps, globalMap)});
  };
  
  handlePriceFromChange = event => {
  	var state = this.state;
  	this.setState({
  		priceRange: [parseInt(event.target.value), state.priceRange[1]]
  	});
  	this.fetchPlaces(globalMapProps, globalMap);
	
  };

  componentDidUpdate(prevProps) {
    if (this.props.payStatus == PAY_SUCCESS && (prevProps.payStatus == PAY_IN_PROGRESS || prevProps.payStatus == PAY_ERROR)) {
      this.setState({reserved: null});
      this.fetchPlaces(globalMapProps, globalMap)
    }
  }
  
  handlePriceChange = (event, newValue) => {
    this.setState({
      priceRange: [parseInt(newValue[0]), parseInt(newValue[1])]
    })
  };

  handleCommittedPriceChange = (event, newValue) => {
  	this.fetchPlaces(globalMapProps, globalMap);
  }

  handleTimeFromChange = val => {
    if (val == null || !isValid(val)) {
      this.setState({
        filterFromTimeMui: val,
        filterFromTime: {}
      }, 
        () => {this.fetchPlaces(globalMapProps, globalMap)
      });
    }
    else {
      var timeStr = format(val, "HH:mm");

      var timeArr = timeStr.split(":");
      
      this.setState({
        filterFromTimeMui: val,
        filterFromTime: {"hours": timeArr[0], "minutes": timeArr[1]}
      }, 
        () => {this.fetchPlaces(globalMapProps, globalMap)
      });
    }
  }

  handleTimeToChange = val => {
    if (val == null || !isValid(val)) {
      this.setState({
        filterToTimeMui: val,
        filterToTime: {}
      }, 
        () => {this.fetchPlaces(globalMapProps, globalMap)
      });
    }
    else {
      var timeStr = format(val, "HH:mm");

      var timeArr = timeStr.split(":");
      
      this.setState({
        filterToTimeMui: val,
        filterToTime: {"hours": timeArr[0], "minutes":timeArr[1]}
      }, 
        () => {this.fetchPlaces(globalMapProps, globalMap)
      });
    }
  }
  
  render() {
    
    const map = (
      <Map
        google={this.props.google}
        zoom={this.state.zoom}
        onReady={this.fetchPlaces}
        // style = {mapStyles}
        styles= {mapStyle}
        initialCenter={this.state.campus}
        center={this.state.campus}
        
      >
        {this.state.posts.map((post, i) => {  
          {
          return <Marker key = {"user"+i}
            name={post.name}
            onClick={this.onMarkerClick}
            position={{lat:post.location.latitude, lng:post.location.longitude}}
            icon={{url: userIcon}}
            post={post}
          />
          }
        })}
                
        {this.state.result.map((element, i) => {   
          {
          return <Marker key = {"public"+i}
            name={element.name}
            onClick={this.onMarkerClick}
            position={element.geometry.location}
            icon={{url: publicIcon}}
          />
          }
        })}

      
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
          onOpen={e => {
            this.onInfoWindowOpen(this.props, e);
          }}
        >
          <div id="reserveButton" />
        </InfoWindow>
      
      </Map>
    );

    const filters = (
      <div style={selectStyle}>
                  
        <Collapsible trigger="Filters" triggerClassName="CustomTriggerCSS">
          
          <br/>

              <InputLabel id="campusLabel">Campus</InputLabel>
              <Select labelId="campusLabel" id="campusSelect" value={this.state.campusName} onChange={this.changeCampus}>
                <MenuItem value="utm">UTM</MenuItem>
                <MenuItem value="utsc">UTSC</MenuItem>
                <MenuItem value="utsg">UTSG</MenuItem>
              </Select>

              <br/>
              <br/>

              <Typography id="range-slider" gutterBottom>
                Price range
              </Typography>
              <Slider
                id="price"
                value={this.state.priceRange}
                onChange={this.handlePriceChange}
                onChangeCommitted={this.handleCommittedPriceChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={(value) => `${value}`}
                style={{width:"200px"}}
                step={5}
                marks
                valueLabelDisplay="on"
              />

            
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                clearable
                disableToolbar
                disablePast
                name="date"
                id="date"
                format="MM/dd/yyyy"
                margin="normal"
                label="Select the date"
                onChange={this.handleDateChange}
                value={this.state.filterDate}
              />
            
              <KeyboardTimePicker
                clearable
                id="fromTime"
                name="fromTime"
                label="Time From"
                margin="normal"
                value={this.state.filterFromTimeMui}
                onChange={this.handleTimeFromChange}
                minutesStep={5}
              />
          
              <KeyboardTimePicker
                clearable
                name="toTime"
                label="Time To"
                margin="normal"
                value={this.state.filterToTimeMui}
                onChange={this.handleTimeToChange}
                minutesStep={5}
              />
            </MuiPickersUtilsProvider>

        </Collapsible>
      </div>
    );
		
    return (
      <div>
          <div>
            <div style={{position: "absolute", zIndex: 1, width: "100%"}}>
              <div>
                <Navbar />
              </div>
              <div style={{position: "absolute", width: "300px", paddingLeft: 10, paddingTop: 10}}>
                {filters}
              </div>
            </div>
            <div style={{zIndex: -1}}>
              <div>
                {map}
              </div>
            </div>
          </div>
        )};
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      payStatus: state.reducers.payReducer.payVer,
  };
}

export default connect(mapStateToProps)(GoogleApiWrapper({
  apiKey: 'AIzaSyC2pitEVGzk92oyuqJ9qhGX9VCZwI0ryjo'
}) (MapContainer));