import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore'
const store = configureStore()

const root = <Provider store={store}>
    <div>Examples</div>
</Provider>
ReactDOM.render(root, document.getElementById('root'))