import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import {IntlProvider, updateIntl} from 'react-intl-redux'
import configureStore from '../store/configureStore'
import routes from '../routes';
import {getDefaultIntl, getTargetIntl} from '../intl'

import {getConfig} from '../util/network'
getConfig(()=>{
    getDefaultIntl((intl)=>{
        const store = configureStore({intl});
        window.setLanguage = function (language) {
            localStorage.appLanguage = language;
            getTargetIntl(language, locale=>{
                store.dispatch(updateIntl(locale));
            })
        }

        window.store = store;
        const history = syncHistoryWithStore(browserHistory, store);
        const root = <Provider store={store}>
            <IntlProvider>
                <Router key="router" history={history} routes={routes} />
            </IntlProvider>
        </Provider>
        ReactDOM.render(root, document.getElementById('root'));
    })
})


