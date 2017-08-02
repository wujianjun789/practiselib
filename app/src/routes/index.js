import React from 'react'
import {Route} from 'react-router'
import App from '../app/container/index'
import {Login} from '../login/components/Login'
import AssetManage from '../assetManage/container/index'
import DomainManage from '../domainManage/container/index'
import PermissionManage from '../permissionManage/container/index'
import SystemOperation from '../systemOperation/container/index'
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
        <Route path="/domainManage" component={DomainManage}>
            <Route path="domainEdit" getComponent={(nextState, cb)=>{
                        require.ensure([], (require)=>{
                            cb(null, require('../domainManage/container/DomainEdit').default)
                        }, 'starriverpro.domainmanage.domainEdit')
            }}/>
            <Route path="mapPreview" getComponent={(nextState, cb)=>{
                        require.ensure([], (require)=>{
                            cb(null, require('../domainMapPreview/container/MapPreview').default)
                        }, 'starriverpro.domainmappreview.mappreview')
            }}/>
        </Route>

        <Route path="/permissionManage" component={PermissionManage}>
        </Route>
        <Route path="/systemOperation" component={SystemOperation}>
            <Route path="lampConCenter" getComponent={(nextState, cb)=>{
                        require.ensure([], (require)=>{
                            cb(null, require('../systemOperation/container/LampConCenter').default)
                        }, 'starriverpro.systemoperation.lampconcenter')
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


