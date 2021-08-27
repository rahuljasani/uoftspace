import { PAY_ERROR, PAY_SUCCESS, PAY_IN_PROGRESS } from "../actions/actionTypes";
  
  const initialState = {
    payVer: PAY_SUCCESS
  };
  
export default (state = initialState, action) => {
    if (action.type === PAY_SUCCESS ) {
        return { ...state, payVer: action.payload };
    } else if (action.type === PAY_ERROR) {
        return { ...state, payVer: action.payload };
    } else if (action.type === PAY_IN_PROGRESS) {
        return { ...state, payVer: action.payload };
    } else {
        return state;
    }
}