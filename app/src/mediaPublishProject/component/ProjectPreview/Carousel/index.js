import React, { Component } from 'react';
import CarouselContainer from './container';
import opsIconBefore from '../project-preview-arrow-before.png';
import opsIconNext from '../project-preview-arrow-next.png';

export default class Carousel extends Component {

  // index srcList onChange
  render() {
    const { index } = this.props;
    const src = this.props.srcList[index];
    return (
      <div id="project-preview-carousel" className="clearfix" >
        <div className="ops-container" onClick={() => { this.props.onChange(index - 1); }} role="presentation">
          <div className="ops-icon" style={{backgroundImage: `url(${opsIconBefore})`}}/></div>  
        <CarouselContainer src={src}/>
        <div className="ops-container" onClick={() => { this.props.onChange(index + 1); }} role="presentation">
          <div className="ops-icon" style={{backgroundImage: `url(${opsIconNext})`}}/></div>
      </div>
    );
  }

}
