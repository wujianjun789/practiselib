import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProgramHeader from './header';
import ProgramShaft from './programShaft';
import { getNumberShaft, getTimeShaft } from './utils';

import '../../../../public/styles/playerProgram.less';

class PlayerProgram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: {},
    };
    this.onClick = this.onClick.bind(this);
    // this.selectDate = this.selectDate.bind(this);
  }

  onClick() { }

  // selectDate(date, dateString) {
  //   this.setState({
  //     date: date,
  //   });
  // }

  render() {
    // countShaft(startTime,endTime,Interval)
    // getTimeShaft(countShaft)
    const numberShaft = getNumberShaft(0, 24, 2);
    const timeShaft = getTimeShaft(numberShaft);
    const { programList = [] } = this.props;
    /** ProgramShaft -- props
      *  1. schedules: [{start:Number,end:Number}] --- Nothing to get a notice~,just remember to keep order
      *  2. totalSec: Number --- Total sec of timeShaft
      *  3. color: String <Default 'gold'> --- ProgramShaft color
      *  4. name: String <Default '我已经天下无敌了！！！'> --- ProgramName
      *  5. scale: Not support yet!
      */
    const programShaftList = programList.map((program, index) => {
      return <ProgramShaft {...program} key={index} onClick={this.onClick}/>;
    });
    return (
      <div id="player-programmer">
        <ProgramHeader timeShaft={timeShaft} selectDate={this.props.selectDate} defaultValue={this.props.defaultValue}/>
        <ul id="program-shaft">
          {programShaftList}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) { return {}}
function mapDispatchToProps(dispatch, ownProps) { return {}}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerProgram);
