import React, { Component } from 'react';
import Header from '../../components/Header';
import List from '../../components/List';
import {connect} from 'react-redux';
export  class About extends Component {

    render() {
        return (
            <div>
               <Header />
               <h1>
                  About page.
               </h1>
               <List list={this.props.list}/>
               <button>click</button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        list: state.test.get('list')
    }
}

 

export default connect(mapStateToProps)(About);