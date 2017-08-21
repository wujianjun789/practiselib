import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'
import { routerActions } from 'react-router-redux'
import {isAdmin,isAuthed} from './auth';


export const isAuthenticated = connectedRouterRedirect({
  authenticatedSelector: state => isAuthed(state.auth.auth),
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'isAuthenticated', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
export const isAdmined= connectedRouterRedirect({
  authenticatedSelector: state => isAdmin(state.auth.auth), 
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'isAdmined', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
