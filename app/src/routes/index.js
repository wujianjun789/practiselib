import React from 'react'
import { Route } from 'react-router'

export default (
    <Route>
        <Route path="/" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../containers/pages/Home').default)
            }, 'home')
        } } />
        <Route path="/about" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../containers/pages/About').default)
            }, 'about')
        } } />
        <Route path="/course" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../containers/pages/Course').default)
            }, 'about')
        } } />
        <Route path="*" getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../containers/NoMatch').default)
            }, 'nomatch')
        } } />
    </Route>
)

