import { combineReducers } from "redux";
import authReducer from "./auth";
import payReducer from "./payReducer";

export default combineReducers({
    authReducer,
    payReducer
  });