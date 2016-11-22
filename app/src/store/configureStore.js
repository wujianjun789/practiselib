import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';


export default function configureStore(initialState) {

    const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
            typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                // Specify here name, actionsBlacklist, actionsCreators and other options
            }) : compose;

    const enhancer = composeEnhancers(
        applyMiddleware(thunk),
        // other store enhancers if any
    );
    const store = createStore(rootReducer, initialState, enhancer);
    return store;

}
