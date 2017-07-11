import React from 'react'
import {Route} from 'react-router'
import App from '../app/container/index'
import Login from '../login/container/Login'
import AssetManage from '../assetManage/container/AssetManage'
import AssetStatistics from '../assetStatistics/container/AssetStatistics'
export default (
    <Route>
        <Route path="/" component={App}>
        </Route>
        <Route path="/login" component={Login}>
        </Route>
        <Route path="/assetManage" component={AssetManage}>
        </Route>
        <Route path="/assetStatistics" component={AssetStatistics}>
        </Route>

        <Route path="*" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../common/containers/NoMatch').default)
            }, 'nomatch')
        } }/>
    </Route>
)

/*<Route path="/home" getComponent={(nextState, cb) => {
 require.ensure([], (require) => {
 cb(null, require('./pages/Home').default)
 }, 'home')
 } }/>
 <Route path="/about" getComponent={(nextState, cb) => {
 require.ensure([], (require) => {
 cb(null, require('./pages/About').default)
 }, 'about')
 } }/>
 <Route path="/course" getComponent={(nextState, cb) => {
 require.ensure([], (require) => {
 cb(null, require('./pages/Course').default)
 }, 'about')
 } }/>*/


