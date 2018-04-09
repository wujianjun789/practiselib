import React from 'react';
import Content from '../../../components/Content';
import Select from '../../component/select';
import PieChart from '../../../components/PieChart';
import { getChildDomainList } from '../../../api/domain';
import { getStatDeviceCount } from '../../../api/reporter';
import '../../../../public/styles/media-publish-stat.less';
import '../../../../public/styles/reporterManage-lighting.less';
import { injectIntl } from 'react-intl';
class Lighting extends React.Component {
  state = {
    domainList: [{ name: '选择域' }],
    currentDomain: null,
    count: 0,
    inline: 0,
    outline: 0,
    normal: 0,
    fault: 0
  };
  componentWillMount() {
    this._isMounted = true;
  }
  componentDidMount() {
    this.initDomainData();
  }
  componentWillUnmount() {
    this._isMounted = false;
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
    getStatDeviceCount(this.state.currentDomain, res => {
      const { count, inline, outline, normal, fault } = res;
      this.setState({ count, inline, outline, normal, fault });
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
      count,
      inline,
      outline,
      normal,
      fault
    } = this.state;
    const dataSource1 = {
      key: 'lighting',
      values: [
        { region: 'inline', count: inline },
        { region: 'outline', count: outline }
      ]
    };
    const dataSource2 = {
      key: 'failure',
      values: [
        { region: 'normal', count: normal },
        { region: 'fault', count: fault }
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
            <h4>{formatMessage({ id: 'app.report.lightingRate' })}</h4>
            <div class="normal-device clearfix">
              <PieChart
                id="normal-device"
                className="left"
                dataSource={dataSource1}
                color={['#fa919c', '#f83d59']}
              />
              <span class={`device-null-tip ${count ? 'hidden' : ''}`}>
                {formatMessage({ id: 'app.report.noDevice' })}
              </span>
              <div class="right">
                <h5>
                  {formatMessage({ id: 'app.report.deviceCount' })}：{count}
                </h5>
                <p>
                  <i class="dot normal-inline" />
                  {formatMessage({ id: 'app.report.online' })}：{inline}
                </p>
                <p>
                  <i class="dot normal-outline" />
                  {formatMessage({ id: 'app.report.offline' })}：{outline}
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
              <span class={`device-null-tip ${count ? 'hidden' : ''}`}>
                {formatMessage({ id: 'app.report.noDevice' })}
              </span>
              <div class="right">
                <h5>
                  {formatMessage({ id: 'app.report.deviceCount' })}：{count}
                </h5>
                <p>
                  <i class="dot fault-inline" />
                  {formatMessage({ id: 'app.report.normal' })}：{normal}
                </p>
                <p>
                  <i class="dot fault-outline" />
                  {formatMessage({ id: 'app.report.error' })}：{fault}
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
