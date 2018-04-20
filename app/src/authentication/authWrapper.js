import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'
import { routerActions } from 'react-router-redux'
import {isAdmin,isAuthed,isLogin,hasAssetModule,hasDomainModule,hasPermissionModule,hasMaintenanceModule,hasLightModule,hasReportModule,hasPublishModule} from './auth';

export const isLogged = connectedRouterRedirect({
  authenticatedSelector: state => isLogin(state.auth.auth),
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'isLogged', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
export const isAuthenticated = connectedRouterRedirect({
  authenticatedSelector: state => isAuthed(state.auth.auth),
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'isAuthenticated', // a nice name for this auth check
  redirectPath: '/login',
  allowRedirectBack: false
})
export const isAdmined= connectedRouterRedirect({
  authenticatedSelector: state => isAdmin(state.auth.auth), 
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'isAdmined', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
export const hasAsset= connectedRouterRedirect({
  authenticatedSelector: state => hasAssetModule(state.auth.auth), 
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'hasPermission', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
export const hasDomain= connectedRouterRedirect({
  authenticatedSelector: state => hasDomainModule(state.auth.auth), 
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'hasPermission', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
export const hasPermission= connectedRouterRedirect({
  authenticatedSelector: state => hasPermissionModule(state.auth.auth), 
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'hasPermission', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
export const hasMaintenance= connectedRouterRedirect({
  authenticatedSelector: state => hasMaintenanceModule(state.auth.auth), 
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'hasPermission', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
export const hasLight= connectedRouterRedirect({
  authenticatedSelector: state => hasLightModule(state.auth.auth), 
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'hasPermission', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
export const hasReport= connectedRouterRedirect({
  authenticatedSelector: state => hasReportModule(state.auth.auth), 
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'hasPermission', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
export const hasPublish= connectedRouterRedirect({
  authenticatedSelector: state => hasPublishModule(state.auth.auth), 
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'hasPermission', // a nice name for this auth check
  redirectPath: '/',
  allowRedirectBack: false
})
