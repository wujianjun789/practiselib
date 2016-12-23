import React from 'react'
import { Route } from 'react-router'

import TestContainer from '../containers/TestContainer';
import NoMatch from '../containers/NoMatch';

export default (
    <Route>
        <Route path="/" component={TestContainer} />
        <Route path="/test" component={TestContainer} />
        <Route path="*" component={NoMatch} />
    </Route>
)

