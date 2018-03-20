import React from 'react';
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
  render() {
    const { index = 0, onChange, pointList = initList, totalTime = initTime } = this.props;

    const checkPointList = pointList.map((point, _index) => {
      const style = { left: `${(point.time / totalTime) * 100}%` };
      const active = _index === index ? 'active' : '';
      return (<div
        className={`checkpoint ${active}`}
        key={_index}
        style={style}
        onClick={() => { onChange(_index); }}
        role="presentation" />);
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