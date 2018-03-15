import React, {Component} from 'react';
import PlayerAreaComponent from './container';

import connect from 'react-redux';

class PlayerArea extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onCancel() {
    console.log('This is on onCancel');
  }

  onConfirm() {
    console.log('This is on onConfirm');
  }

  onChange() {
    console.log('This is onChange');
  }

  render() {
    return (<PlayerAreaComponent onCancel={this.onCancel} onConfirm={this.onConfirm} onChange={this.onChange}/>);
  }
}

function mapStateToProps(state) { }
function mapDispatchToProps(dispatch, ownProps) {}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerArea);