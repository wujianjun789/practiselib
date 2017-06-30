import React from 'react'
import {Route} from 'react-router'
import App from '../App/container/index'
import Login from '../login/container/Login'
export default (
    <Route>
        <Route path="/" component={App}>
        </Route>
        <Route path="/login" component={Login}>
        </Route>
        <Route path="/home" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../containers/pages/Home').default)
            }, 'home')
        } }/>
        <Route path="/about" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../containers/pages/About').default)
            }, 'about')
        } }/>
        <Route path="/course" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../containers/pages/Course').default)
            }, 'about')
        } }/>
        <Route path="*" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../containers/NoMatch').default)
            }, 'nomatch')
        } }/>
    </Route>
)


