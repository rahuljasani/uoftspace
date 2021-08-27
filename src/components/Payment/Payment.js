import React, { useState, useRef, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Container from '@material-ui/core/Container';
import StripeCheckout from "react-stripe-checkout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";
import logo from '../Assets/uoft-logo.png';
import { handleStripe } from "../../actions/pay";
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import requireAuth from "../requireAuth";
import firebase from "../../services/firebase";



toast.configure();

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles(theme => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      borderRadius: '25px',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  
const Payment = ({ handle, cost, post, client}) => {
	
	console.log(cost);
	console.dir(post);
	
    // const [error, setError] = useState(null);
    const paypalRef = useRef();

    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [didMount, setMount] = useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleFailure = (err) => {
        toast("Something went wrong! Payment did not go through", { type: 'error'});
    }

    console.log(client);

    const handleSuccess = async (details, data) => {

      console.log(post)
      
      const postRef = firebase.firestore().collection('posts').doc(post.postId);
      postRef.update({
        booked: true,
        bookedBy: firebase.auth().currentUser.uid
      });

      const userRef = firebase.firestore().collection('users').doc(client.uid);
      const user = await firebase.firestore().collection('users').doc(client.uid).get();
      var postHistory = user.get("purchased"); 
      if (!postHistory) postHistory = []; 
      postHistory.push(post.postId)
      userRef.update({
        purchased: postHistory,
      });

      toast("Success! Your receipt will be sent to your email", { type: 'success'});
      handleClose(); 
    }
  

    function handleStripe(token){
        if(handle(token, 100) === 0){
            handleFailure();
        }
        else{
			handleSuccess();
            //toast("Success! Your receipt will be sent to your email", { type: 'success'});
            handleClose(); 
        }
    }


    return(
    <div>
        <Button type="button" variant="contained" color="primary" onClick={handleOpen}>
            Purchase
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
        >
		  <>
          <div style={modalStyle} className={classes.paper}>
                <script src="https://www.paypal.com/sdk/js?client-id=ARNRNvgJTH0oaRUrQUC-p-MgCXzIOl5T6um6YqdW7U9mkwzV-ZkfCtp9c0QH6dRWArJY85Yh3rLCT5Vu"></script>
                <center>
                <Container>
                    <h3>Amount:  ${cost} USD</h3>
                </Container>
                
                <Container>
                <StripeCheckout stripeKey="pk_test_6aqX2sq3fmOyw2PYCUVNBtYH00jUH1Ynug"
                                token={handleStripe}
                                amount={cost*100}
                />
                </Container> 
				
				<br/>
                
                <Container>
                <PayPalButton
                    amount={cost.toString()}
                    onSuccess={handleSuccess}
                    onError={handleFailure}
                />
                </Container>
                </center>
          </div>
		  </>
        </Modal>
      </div>
    )
}

function mapStateToProps(state) {
    return {
        handle: state.reducers.payReducer.payVer,
        client: state.firebase.auth,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handle: (token) =>
            dispatch(handleStripe(token)),
    };
  }

  export default connect (mapStateToProps, mapDispatchToProps)(Payment);
