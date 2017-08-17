
import { getAuth } from './auth';
export const initialState = { auth: getAuth() };
export default function auth(state = initialState, action) {
  switch (action.type) {
    case 'LOGED_IN':
      return { auth:action.auth };
    case 'LOGED_OUT':
      return {  };
    default:
      return state;
  }
}