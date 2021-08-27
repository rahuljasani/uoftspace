import React, { useState, useRef, Component } from "react";
import { ChatFeed, Message } from 'react-chat-ui'
import { connect } from "react-redux";
import requireAuth from "../requireAuth";
import {Container} from "@material-ui/core"
import './message.css'
import firebase from "../../services/firebase";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Input, TextField } from '@material-ui/core';
// new Message({
//   id: 1,
//   message: "I'm the seller! You are interested in buying my parking spoty?",
// }), // Gray bubble
// new Message({ id: 0, message: "Yes! I really need it!", senderName: 'acegoku', })
import Navbar from "../Navbar/Navbar"
class Chat extends Component {
    constructor() {
      super();
      this.state = {
        messages: [],
        images: [],
        user: {},
        receiver: "",
        receiverImg: "",
        isAuthenticated: false,
        test: "",
        name: "",
        pastMessages: [],
        pastUsers: []
      };
    }
  
    async signIn() {
      const googleProvider = new firebase.auth.GoogleAuthProvider();
      try {
        await firebase.auth().signInWithPopup(googleProvider);
      } catch (error) {
        console.error(error);
      }
    }
  
    signOut() {
      firebase.auth().signOut();
    }

    
    async componentDidMount() {
      const { match: { params } } = this.props;
      
      if(!params.uid){
        this.props.history.push("/home")
      }
      let db = firebase.firestore() 
      let query = await db.collection('users').doc(params.uid).get()
      let data = query.data();

      firebase.auth().onAuthStateChanged(async user => {
        console.log(user)
        if (user) {
          this.setState({ isAuthenticated: true, user, receiver: params, name: data.firstname });
          this.loadMessages();
        } else {
          this.setState({ isAuthenticated: false, user: {}, messages: [], receiver: params, name: data.firstname });
        }
      });
    }
    
    async loadMessages() {
      let db = firebase.firestore()
      db.collection('users').doc(this.state.receiver.uid).get().then(query =>{
        let data = query.data();
        
        let img = "https://i.imgur.com/b08hxPY.png";
        if(data.avatarUrl){
          img = data.avatarUrl
        }
        this.setState({receiverImg: img})
      });

      const callback = snap => {
        const dbMssg = snap.val();

        if(dbMssg.user.uid === this.state.user.uid && dbMssg.receiver.uid === this.state.receiver.uid){
            console.log("1")
            const message = new Message({ id: 0, message: dbMssg.text})
            const { messages } = this.state;
            messages.push(message);
            this.setState({ messages });
        }
        else if(dbMssg.user.uid === this.state.receiver.uid && dbMssg.receiver.uid === this.state.user.uid){
            console.log("2")
            const message = new Message({ id: 1, message: dbMssg.text});
            const { messages } = this.state;
            messages.push(message);
            this.setState({ messages });
        }

        else{
          let db = firebase.firestore()
          if(dbMssg.user.uid === this.state.user.uid){
            if (!(this.state.pastMessages.includes(dbMssg.receiver.uid))){
              db.collection('users').doc(dbMssg.receiver.uid).get().then(query =>{
                let data = query.data();
                let name = data.firstname
                
                let image = data.avatarUrl;
                
                if(!image){
                  image = "https://i.imgur.com/b08hxPY.png";
                }

                this.setState({
                  pastUsers: [...this.state.pastUsers, {name: [name, dbMssg.receiver.uid, image]}]
                })
              })
              this.setState({
                pastMessages: [...this.state.pastMessages, dbMssg.receiver.uid]
              })
            }
          }
          else if(dbMssg.receiver.uid === this.state.user.uid){
            
            if (!(this.state.pastMessages.includes(dbMssg.user.uid))){
              db.collection('users').doc(dbMssg.user.uid).get().then(query =>{
                let data = query.data();
                let name = data.firstname
                let image = data.avatarUrl;
                
                if(!image){
                  image = "https://i.imgur.com/b08hxPY.png";
                }
                this.setState({
                  pastUsers: [...this.state.pastUsers, {name: [name, dbMssg.user.uid, image]}]
                })
              })
              this.setState({
                pastMessages: [...this.state.pastMessages, dbMssg.user.uid]
              })
            }
          }
        }
      };
      firebase
        .database()
        .ref("/messages/")
        .orderByChild('timestamp')
        .on("child_added", callback);
    }

    handleChange (e) {
        const test = e.target.value; 
        console.log(test)
        this.setState({test:test})
    }
  
    renderPopup() {
      return (
        <Dialog open={!this.state.isAuthenticated}>
          <DialogTitle id="simple-dialog-title">Sign in</DialogTitle>
          <div>
            <List>
              <ListItem button onClick={() => this.signIn()}>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#eee" }}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      height="30"
                      alt="G"
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Sign in with Google" />
              </ListItem>
            </List>
          </div>
        </Dialog>
      );
    }
  
    onSend(message) {
        let userInfo = {uid: this.state.user.uid, name: this.state.user.email}
        let dbMessage = {text: message.message, user: userInfo, receiver: {uid: this.state.receiver.uid}, timestamp: firebase.firestore.Timestamp.now()}
        this.saveMessage(dbMessage);
    }
    

    saveMessage(message) {
      return firebase
        .database()
        .ref("/messages/")
        .push(message)
        .catch(function(error) {
          console.error("Error saving message to Database:", error);
        });
    }
  
    renderSignOutButton() {
      if (this.state.isAuthenticated) {
        return <Button onClick={() => this.signOut()}>Sign out</Button>;
      }
      return null;
    }
  
    renderChat() {
      return (
        <ChatFeed
        messages={this.state.messages} // Boolean: list of message objects
        isTyping={this.state.is_typing} // Boolean: is the recipient typing
        hasInputField={false} // Boolean: use our input, or use your own
        showSenderName // show the name of the user who sent the message
        bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
        // JSON: Custom bubble styles
        bubbleStyles={
          {
            text: {
              fontSize: 15
            },
            chatbubble: {
              borderRadius: 25,
              padding: 5
            }
          }
        }
      />
      );
    }
    
    onChangeMessage(e){
      let val = e.target.getAttribute("value")
      if(val){
        let arr = this.state.pastUsers[val]
        this.props.history.push(("/chat/" + (arr.name[1])))
        window.location.reload();
      }
    }
    renderChannels() {
      return (
        <List>
          <ListItem button>
            <ListItemAvatar>
              <Avatar src={this.state.receiverImg}/>
            </ListItemAvatar>
            <ListItemText primary={this.state.name} />
          </ListItem>

          {(()=>{
            let listItems = [];
            console.log(this.state.pastUsers)
            for(var i = 0; i < this.state.pastUsers.length;i++){
              listItems.push(
                <ListItem onClick={this.onChangeMessage.bind(this)} key={i} value={i} button>
                  <ListItemAvatar value={i}>
                    <Avatar src={this.state.pastUsers[i]["name"][2]} />
                  </ListItemAvatar>
                  <ListItemText value={i} primary={this.state.pastUsers[i]["name"][0]} />
                </ListItem>
              )
            }
            return listItems
          })()}
          
          {/* this.state.pastUsers.map(function(object, i){
            return <ListItem onClick={this.onChangeMessage} key={i} value={i} button>
                    <ListItemAvatar value={i}>
                      <Avatar>{object[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText value={i} primary={object} />
                  </ListItem>
          })} */}
        </List>


      );
    }
  
    renderChannelsHeader() {
      return (
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Channels
            </Typography>
          </Toolbar>
        </AppBar>
      );
    }
    renderChatHeader() {
      return (
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              {this.state.name}
            </Typography>
          </Toolbar>
        </AppBar>
      );
    }
  
    render() {
      return (
        <div>
          <Navbar />
          <div style={styles.container}>
            
            {this.renderPopup()}
            <div style={styles.channelList}>
              {this.renderChannelsHeader()}
              {this.renderChannels()}
            </div>
            <div style={styles.chat}>
              {this.renderChatHeader()}
              {this.renderChat()}
              <TextField
                id="filled-textarea"
                label="Type a message..."
                // placeholder="Placeholder"
                multiline
                rows={1}
                rowsMax={3}
                variant="filled"
                onChange={(event) => {this.setState({test:event.target.value})}}
              />
              <Button variant="contained" color="primary" onClick={() => {
                  const { messages } = this.state;
                  const { test } = this.state;
                  if(test){
                      let newMessage = new Message({ id: 0, message: test, senderName: 'acegoku', })
                      document.getElementById("filled-textarea").value = "";
                      this.onSend(newMessage);
                      this.setState({ messages: messages, test:"" });
                  }
              }}> Send </Button>              
            </div>
          </div>
        </div>
      );
    }
  }

  const styles = {
    container: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      height: "93vh",
    },
    channelList: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
    },
    chat: {
      display: "flex",
      flex: 3,
      flexDirection: "column",
      borderWidth: "1px",
      borderColor: "#ccc",
      borderRightStyle: "solid",
      borderLeftStyle: "solid",
    },
    settings: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
    },
  };

export default requireAuth(Chat);