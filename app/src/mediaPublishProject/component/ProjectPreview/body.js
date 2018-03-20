import React, {Component} from 'react';
import Carousel from './Carousel';
import Progress from './Progress/container';
const mockArray = [
  {
    src: 'https://i.loli.net/2018/01/03/5a4c93e92b0e1.png',
    time: 500,
  },
  {
    src: 'https://i.loli.net/2018/01/03/5a4c93e931f93.png',
    time:1200,
  }, {
    src: 'https://i.loli.net/2018/01/03/5a4c93e938b6b.png',
    time: 1500,
  }];

export default class PreviewBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.changeIndex = this.changeIndex.bind(this);
  }

  changeIndex(index) {
    const { imgArray = mockArray } = this.props;
    // const { length = 3 } = this.props.imgArray;
    const length = imgArray.length;
    if (index > length - 1) { index = length - 1; }
    if (index < 0) { index = 0; }
    this.setState({ index: index });
  }

  render() {
    const { index } = this.state;
    const { imgArray = mockArray, totalTime = 3000 } = this.props;
    const pureSrcList = imgArray.map((item) => { return item.src; });
    const purePointList = imgArray.map((item) => { return { time: item.time }; });
    return (
      <div id="preview-body">
        <Carousel srcList={pureSrcList} index={index} onChange={this.changeIndex} />
        <Progress pointList={purePointList} index={index} onChange={this.changeIndex} totalTime={totalTime}/>
      </div>);
  }
}