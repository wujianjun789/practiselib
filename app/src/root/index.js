import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from '../store/configureStore'
import routes from '../routes';
const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store);

import {getConfig} from '../util/network'
const root = <Provider store={store}>
    <Router key="router" history={history} routes={routes} />
</Provider>
ReactDOM.render(root, document.getElementById('root'), getConfig)