import React from 'react'
import {Route} from 'react-router'
import App from '../app/container/index'
import {Login} from '../login/components/Login'
import AssetManage from '../assetManage/container/index'
export default (
    <Route>
        <Route path="/" component={App}>
        </Route>
        <Route path="/login" component={Login}>
        </Route>
        <Route path="/assetManage" component={AssetManage}>
            <Route path="manage" getComponent={(nextState, cb)=>{
                        require.ensure([], (require)=>{
                            cb(null, require('../assetManage/container/AssetManage').default)
                        }, 'starriverpro.assetmanage.manage')
            }}/>
            <Route path="statistics" getComponent={(nextState, cb)=>{
                        require.ensure([], (require)=>{
                            cb(null, require('../assetStatistics/container/AssetStatistics').default)
                        }, 'starriverpro.assetmanage.statistics')
            }}/>
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


