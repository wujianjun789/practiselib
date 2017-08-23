import { getAuth, clearAuth} from './auth';
import {AUTH} from './actionTypes'
export const initialState = { auth: getAuth() };
export default function auth(state = initialState, action) {
  switch (action.type) {
    case 'AUTH':
      return { auth: action.auth };  
    default:
      return state;
  }
}