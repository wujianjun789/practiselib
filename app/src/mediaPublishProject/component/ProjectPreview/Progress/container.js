import React from 'react';
// import Bubble from '../Bubble';

import '../../../../../public/styles/progress.less';

const mockData = {
  list: [{
    time: 500,
  }, {
    time: 1200,
  },
  {
    time: 2000,
  }],
  totalTime: 3000,
};
const { list: initList, totalTime: initTime } = mockData;

// index onChange pointList
export default class Progress extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     bubbleVisiable: false,
  //   };
  //   this.showBubble = this.showBubble.bind(this);
  // }

  // showBubble() {
  //   this.setState({
  //     bubbleVisiable:true,
  //   });
  // }

  render() {
    const { index = 0, onChange, pointList = initList, totalTime = initTime } = this.props;

    const checkPointList = pointList.map((point, _index) => {
      const style = { left: `${(point.time / totalTime) * 100}%` };
      const active = _index === index ? 'active' : '';
      return (
        <div
          className={`checkpoint ${active}`}
          style={style}
          key={_index}
          onClick={() => { onChange(_index); }}
          onMouseEnter={this.showBubble}
          role="presentation" />
      );
    });
    
    const completedStyle = {width:`${(pointList[index].time / totalTime) * 100}%`};

    return (
      <div id="progress-container"> 
        <div id="completed-progress" style={completedStyle}/>  
        {checkPointList}
      </div>
    );
  }
}