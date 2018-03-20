import React, { Component } from 'react';
import CarouselContainer from './container';

export default class Carousel extends Component {

  // index srcList onChange
  render() {
    const { index } = this.props;
    const src = this.props.srcList[index];
    return (
      <div id="project-preview-carousel" className="clearfix" >
        <div className="ops-container" onClick={() => { this.props.onChange(index - 1); }} role="presentation">
          <div className="ops-icon" /></div>  
        <CarouselContainer src={src}/>
        <div className="ops-container" onClick={() => { this.props.onChange(index + 1); }} role="presentation">
          <div className="ops-icon" /></div>
      </div>
    );
  }

}
