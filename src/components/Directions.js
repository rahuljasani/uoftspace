import React, { Component } from "react";
import requireAuth from "./requireAuth";

import axios from 'axios';

const HERE_API_KEY = 'gXuPcVBAQAv3tMyNvuktcTNK1HWZx7Np32GnvC92q1M';
const GOOGLE_API_KEY = 'AIzaSyC2pitEVGzk92oyuqJ9qhGX9VCZwI0ryjo';

export class Directions extends Component {
  state = {
    actions = []
  }

  // Handle field changes
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleDirections = ( from, to ) => {

    const self = this;
    
    axios.get('',
      {'params': {
        'apiKey': HERE_API_KEY,
        'transportMode': 'car',
        'origin': {from},
        'destination': {to},
        'return': 'polyline,actions,instructions'
      }}).then(function (response) {
          if (response.data){
            if (response.data.routes){
              if (response.data.routes[0]){
                const actions = response.data.routes[0].sections[0].actions;
                self.setState({
                  actions: actions
                })
              }  
            }  
          }
      });
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}

export default requireAuth(Directions);
