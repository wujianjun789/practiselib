import React from 'react';
import common from './Common';
import Select from '../../components/Select.1';
import { injectIntl } from 'react-intl';
import { message } from 'antd';
import { updateAssetsRpcById } from '../../api/asset';
import columns from '../TableData/ssgwTable.json';

class DeviceOperation extends React.Component {
  state = {
    currentControlMode: 'remote',
    controlModeList: {
      titleField: 'title',
      valueField: 'value',
      options: [
        {
          title: this.props.intl.formatMessage({
            id: 'lightManage.list.remote'
          }),
          value: 'remote'
        },
        {
          title: this.props.intl.formatMessage({ id: 'lightManage.list.auto' }),
          value: 'auto'
        }
      ]
    }
  };
  onChange = e => {
    const { id, value } = e.target;
    switch (id) {
      case 'controlMode':
        this.setState({ currentControlMode: value });
        break;
    }
  };
  controlModeApply = () => {
    const { id } = this.props.currentDevice;
    const { currentControlMode } = this.state;
    updateAssetsRpcById(id, { mode: currentControlMode }, res => {
      if (res.success) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    });
  };
  checkTimeApply = () => {
    const { id } = this.props.currentDevice;
    updateAssetsRpcById(id, { updateTime: true }, res => {
      if (res.success) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    });
  };
  componentDidUpdate() {
    console.log(this.state);
  }
  render() {
    const { disabled } = this.props;
    const { formatMessage } = this.props.intl;
    const { currentControlMode, controlModeList } = this.state;
    return (
      <div>
        <div className="control-mode">
          <span className="tit">
            {formatMessage({
              id: 'lightManage.list.controlMode'
            })}：
          </span>
          <Select
            id="controlMode"
            titleField={controlModeList.titleField}
            valueField={controlModeList.valueField}
            options={controlModeList.options}
            value={currentControlMode}
            onChange={this.onChange}
            disabled={disabled}
          />
          <button
            className="btn btn-primary"
            disabled={disabled}
            onClick={this.controlModeApply}
          >
            {formatMessage({
              id: 'lightManage.list.apply'
            })}
          </button>
        </div>
        <div>
          <span className="tit">
            {formatMessage({
              id: 'lightManage.list.timing'
            })}：
          </span>
          <span className="note">
            {formatMessage({ id: 'lightManage.list.checkTime' })}
          </span>
          <button
            className="btn btn-primary"
            disabled={disabled}
            onClick={this.checkTimeApply}
          >
            {formatMessage({
              id: 'lightManage.list.apply'
            })}
          </button>
        </div>
      </div>
    );
  }
}

export default common(injectIntl(DeviceOperation));
