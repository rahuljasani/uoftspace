
import firebase from "../services/firebase";
import { PAY_SUCCESS,  PAY_ERROR, PAY_IN_PROGRESS } from "./actionTypes";
import uuid from "uuid/v4";


export const handleStripe = (token, price) => async dispatch => {
    // Try to register user iff successful dispatch REGISTER_SUCCESS else REGISTER_ERROR
    try {
        dispatch({
            type: PAY_IN_PROGRESS,
            payload: PAY_IN_PROGRESS
        });
        let response = await fetch('/api/payment/stripe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                token,
                price
            }),
        });
        console.log(response);
        dispatch({
            type: PAY_SUCCESS,
            payload: PAY_SUCCESS
        });
        return PAY_SUCCESS;
    } catch (err) {
        console.log(err);
        dispatch({
            type: PAY_ERROR,
            payload: PAY_ERROR
        });
        return PAY_ERROR;
    }
};