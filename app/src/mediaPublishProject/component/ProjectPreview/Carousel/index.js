import React, { Component } from 'react';
import CarouselContainer from './container';

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      sourceArray: [],
      virtualArray:[],
    };
    this.magicClick = this.magicClick.bind(this);
  }

  magicClick(opsCode) {
    const statusCoude = this.state;

    console.log(opsCode);
  }

  renderArray() {
    
  }

  render() {
    return (
      <div id="project-preview-carousel" className="clearfix" >
        <div className="img-container" onClick={() => { this.magicClick(1); }}>-</div>  
        <CarouselContainer />
        <div className="img-container" onClick={() => { this.magicClick(-1); }}>+</div> 
      </div>
    );
  }

}
