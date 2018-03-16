import React, { Component } from 'react';
import TextContainer from './container';
// import connect from 'react-redux';

export default class PlayItemText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorValue:{
        bgColor: 'goldenrod',
        fontColor: 'pink',
      },
    };
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.colorChange = this.colorChange.bind(this);
  }

  onCancel() {
  }

  onConfirm() { }
  
  onChange() { }
  
  colorChange(item, color) {
    this.setState({
      colorValue: {
        ...this.state.colorValue,
        [item]:color,
      },
    });
  }

  render() {
    const {colorValue} = this.state;
    return (<TextContainer colorChange={this.colorChange} colorValue={colorValue} />);
  }
}

// function mapStateToProps(state) { }
// function mapDispatchToProps(disptach, ownProps) {}

// export default connect(mapStateToProps, mapDispatchToProps)(PlayItemTextComponent);