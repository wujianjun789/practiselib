import React, { Component } from 'react';
import {connect} from 'react-redux';
import Header from '../../components/Header';
import TestComponent from '../../components/TestComponent';
import * as actions from '../../actions';
export  class Home extends Component {

    render() {
        return (
            <div>
                <Header />
                <TestComponent value="Home page!" />
                <button onClick={this.props.inc}>
                    {'click to inc ' }
                    {
                        this.props.value
                    }
                </button>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        value: state.test.get('value')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        inc: () => {
            dispatch(actions.test_inc());
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);