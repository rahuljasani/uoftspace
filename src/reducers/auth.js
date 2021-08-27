import { REGISTER_SUCCESS, REGISTER_ERROR, LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_EMAIL_ERROR } from "../actions/actionTypes";
  
  const initialState = {
    authMsg: ""
  };
  
export default (state = initialState, action) => {
    if (action.type === LOGIN_SUCCESS ) {
        return { ...state, authMsg: action.payload };
    } else if (
        action.type === REGISTER_SUCCESS ||
        action.type === REGISTER_ERROR ||
        action.type === LOGIN_ERROR ||
        action.type === LOGIN_EMAIL_ERROR
    ) {
        return { ...state, authMsg: action.payload };
    } else {
        return state;
    }
}