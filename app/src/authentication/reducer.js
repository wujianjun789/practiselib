import {deleteCookie} from '../util/cache'
import { getAuth } from './auth';
export const initialState = { auth: getAuth() };
export default function auth(state = initialState, action) {
  switch (action.type) {
    case 'LOGED_IN':
      return { auth: getAuth() };
    case 'LOGED_OUT':
      deleteCookie('user');
      return { auth: getAuth() };
    default:
      return state;
  }
}