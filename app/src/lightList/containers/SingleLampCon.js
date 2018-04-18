import React from 'react';
import common from './Common';
import Select from '../../components/Select.1';
import { injectIntl } from 'react-intl';
import { getLightLevelConfig } from '../../util/network';
import { updateAssetsRpcById } from '../../api/asset';
import { message } from 'antd';

import columns from '../TableData/ssslcTable.json';
class DeviceOperation extends React.Component {
  state = {
    currentSwitchStatus: 'on',
    deviceSwitchList: {
      titleField: 'title',
      valueField: 'value',
      options: [
        {
          value: 'on',
          title: this.props.intl.formatMessage({ id: 'lightManage.list.on' })
        },
        {
          value: 'off',
          title: this.props.intl.formatMessage({ id: 'lightManage.list.off' })
        }
      ]
    },
    currentBrightness: 0,
    brightnessList: {
      titleField: 'title',
      valueField: 'value',
      options: []
    }
  };
  componentWillMount() {
    this._isMounted = true;
    getLightLevelConfig(this.updateBrightnessList);
  }

  onChange = e => {
    const { id, value } = e.target;
    switch (id) {
      case 'deviceSwitch':
        this.setState({ currentSwitchStatus: value });
        break;
      case 'dimming':
        this.setState({ currentBrightness: value });
        break;
    }
  };
  updateBrightnessList = data => {
    if (!this._isMounted) {
      return;
    }
    // ["关", 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    let opt = [];
    data.shift(); // 删除"关"
    data.forEach(value => {
      let val = value;
      let title = `${val}`;
      opt.push({ value: val, title });
    });
    this.setState({
      brightnessList: Object.assign({}, this.state.brightnessList, {
        options: opt
      })
    });
  };
  switchApply = () => {
    const { id } = this.props.currentDevice;
    const { currentSwitchStatus } = this.state;
    updateAssetsRpcById(id, { status: currentSwitchStatus }, res => {
      if (res.success) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    });
  };
  dimmingApply = () => {
    const { id } = this.props.currentDevice;
    const { currentBrightness } = this.state;
    updateAssetsRpcById(id, { brightness: currentBrightness }, res => {
      if (res.success) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    });
  };
  render() {
    const { disabled } = this.props;
    const { formatMessage } = this.props.intl;
    const {
      currentSwitchStatus,
      deviceSwitchList,
      currentBrightness,
      brightnessList
    } = this.state;
    return (
      <div>
        <div className="device-switch">
          <span className="tit">
            {formatMessage({ id: 'lightManage.list.switch' })}：
          </span>
          <Select
            id="deviceSwitch"
            titleField={deviceSwitchList.titleField}
            valueField={deviceSwitchList.valueField}
            options={deviceSwitchList.options}
            value={currentSwitchStatus}
            onChange={this.onChange}
            disabled={disabled}
          />
          <button
            className="btn btn-primary"
            disabled={disabled}
            onClick={this.switchApply}
          >
            {formatMessage({ id: 'lightManage.list.apply' })}
          </button>
        </div>
        <div>
          <span className="tit">
            {formatMessage({ id: 'lightManage.list.dimming' })}：
          </span>
          <Select
            id="dimming"
            titleField={brightnessList.titleField}
            valueField={brightnessList.valueField}
            options={brightnessList.options}
            value={currentBrightness}
            onChange={this.onChange}
            disabled={disabled}
          />
          <button
            className="btn btn-primary"
            disabled={disabled}
            onClick={this.dimmingApply}
          >
            {formatMessage({ id: 'lightManage.list.apply' })}
          </button>
        </div>
      </div>
    );
  }
}

export default common(injectIntl(DeviceOperation));
