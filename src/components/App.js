import React from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import { isLoaded } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

import Login from "./Auth/Login";
import Registeration from "./Auth/Registration";
import Payment from "./Payment/Payment";
import Home from "./Home";
import Loading from "./Loading/Loading"
import PostParkingSpot from "./PostParkingSpot/PostParkingSpot"
import MapView from "./Map";
import UserProfile from "./Profile"
import PostReview from "./Reviews/PostReview";
import ViewReviews from "./Reviews/ViewReviews";
import Profile from "./ProfileDisplay/Profile";
import Chat from "./Messaging/Chat";
import PreviousTransactions from "./PrevTransactions/PrevTransactions";
import Post from "./Post";
import PostHistory from "./PostHistory/PostHistory";

function AuthIsLoaded({ children }) {
  const auth = useSelector(state => state.firebase.auth)
  if (!isLoaded(auth)) return <Loading />;
  return children
}

const App = () => {
  return ( 
    <BrowserRouter>
      <Switch>
      <Redirect exact from="/" to="/login" />
        <AuthIsLoaded>
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={UserProfile} />
          <Route exact path="/registeration" component={Registeration} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/pay" render={() => <Payment cost={100}/>} />
          <Route exact path="/post" component={PostParkingSpot} />
          <Route exact path="/post/:uid" component={Post}/>
          <Route exact path="/map" component={MapView} />
          <Route exact path="/chat/:uid" component={Chat} />
          <Route exact path="/review" component={PostReview}/>
          <Route exact path="/reviews/:uid" component={ViewReviews}/>
          <Route exact path="/profile/:uid" component={Profile}/>
          <Route exact path="/PrevTransaction" component={PreviousTransactions}/>
          <Route exact path="/PostHistory" component={PostHistory}/>
        </AuthIsLoaded>
      </Switch>
    </BrowserRouter>
  );
}
export default App;