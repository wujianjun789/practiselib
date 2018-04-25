import React from 'react';
import Content from '../../../components/Content';
import Select from '../../component/select';
import PieChart from '../../../components/PieChart';
import { getChildDomainList } from '../../../api/domain';
import { getFaultCount, getLightCount } from '../../../api/reporter';
import '../../../../public/styles/media-publish-stat.less';
import '../../../../public/styles/reporterManage-lighting.less';
import { injectIntl } from 'react-intl';
class Lighting extends React.Component {
  state = {
    domainList: [{ name: '选择域' }],
    currentDomain: null,
    onlineTotal: 0,
    light: 0,
    deviceTotal: 0,
    fault: 0
  };
  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this.initDomainData();
  }
  initDomainData = () => {
    getChildDomainList(data => {
      this._isMounted && this.updateDomainData(data);
    });
  };
  updateDomainData = data => {
    if (!data.length) {
      return;
    }
    this.setState(
      { currentDomain: data[0], domainList: data },
      this.initDeviceData
    );
  };
  initDeviceData = () => {
    getFaultCount('ssslc', this.state.currentDomain.id, res => {
      const { deviceTotal, fault } = res;
      this.setState({ deviceTotal, fault });
    });
    getLightCount('ssslc', this.state.currentDomain.id, res => {
      const { onlineTotal, light } = res;
      this.setState({ onlineTotal, light });
    });
  };
  onChangeHandler = e => {
    const { id, selectedIndex } = e.target;
    if (id === 'domain') {
      this.setState(
        {
          currentDomain: this.state.domainList[selectedIndex]
        },
        this.initDeviceData
      );
    }
  };
  render() {
    const { formatMessage } = this.props.intl;
    const {
      domainList,
      currentDomain,
      onlineTotal,
      light,
      deviceTotal,
      fault
    } = this.state;
    const dataSource1 = {
      key: 'lighting',
      values: [
        { region: 'light', count: light },
        { region: 'nolight', count: onlineTotal - light }
      ]
    };
    const dataSource2 = {
      key: 'failure',
      values: [
        { region: 'fault', count: fault },
        { region: 'normal', count: deviceTotal - fault }
      ]
    };
    return (
      <Content class="stat-lighting">
        <div class="heading">
          <Select
            className="select-domain"
            id="domain"
            options={domainList}
            current={currentDomain}
            onChange={this.onChangeHandler}
          />
        </div>
        <div class="contaienr">
          <div class="media-publish-stat">
            <h4>{formatMessage({ id: 'lightManage.Statistics.lightOn' })}</h4>
            <div class="normal-device clearfix">
              <PieChart
                id="normal-device"
                className="left"
                dataSource={dataSource1}
                color={['#f83d59', '#fa919c']}
              />
              <span class={`device-null-tip ${onlineTotal ? 'hidden' : ''}`}>
                {formatMessage({ id: 'app.report.noDevice' })}
              </span>
              <div class="right">
                <h5>
                  {formatMessage({ id: 'app.report.onlineTotal' })}：{
                    onlineTotal
                  }
                </h5>
                <p>
                  <i class="dot light-dot" />
                  {formatMessage({ id: 'app.report.light' })}：{light}
                </p>
              </div>
            </div>
          </div>
          <div class="media-publish-stat">
            <h4>{formatMessage({ id: 'app.report.failureRate' })}</h4>
            <div class="fault-device clearfix">
              <PieChart
                id="fault-device"
                className="left"
                dataSource={dataSource2}
              />
              <span class={`device-null-tip ${deviceTotal ? 'hidden' : ''}`}>
                {formatMessage({ id: 'app.report.noDevice' })}
              </span>
              <div class="right">
                <h5>
                  {formatMessage({ id: 'app.report.deviceTotal' })}：{
                    deviceTotal
                  }
                </h5>
                <p>
                  <i class="dot fault-dot" />
                  {formatMessage({ id: 'sysOperation.fault' })}：{fault}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Content>
    );
  }
}

export default injectIntl(Lighting);
