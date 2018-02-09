import React, { PureComponent } from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from './../../components/Panel';
import PanelFooter from './../../components/PanelFooter';

import NotifyPopup from '../../common/containers/NotifyPopup';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';
/**
 * Domain component
 * @param {String}      title       'domain title,
 * @param {Object}      data        'domain data,  example:{}'
 * @param {Func}        onConfirm   'panel save button handler'
 * @param {Func}        onCancel    'panel close button handler'
 * 
 */


import { FormattedMessage, injectIntl } from 'react-intl';
import { intlFormat } from '../../util/index';


import { Name2Valid, latdetailValid, latValid } from '../../util/index';
import { detailValid } from '../../util/index';
export default class TypeEditPopup extends Component {
  constructor(props) {
    super(props);
    const { name, description, power, life, manufacture } = this.props.data;
    this.state = {
      name: name,
      description: description,
      power: power,
      life: life,
      manufacture: manufacture,
      prompt: {
      },
      addFirstTime: this.props.idAdd, //如果是add并且是第一次加载页面，不提示非法输入
    };
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.mounted = false;
  }

  componentWillUnmout() {
    this.mounted = true;
  }

  onConfirm() {
    console.log('state:', this.state);
    this.props.onConfirm && this.props.onConfirm(this.state);
  }

  onCancel() {
    this.props.onCancel();
  }

  onChange(e) {
    console.log('e.target:', e.target);
    let id = e.target.id;
    let value = e.target.value;
    let newValue = '';
    let prompt = false;
    if (id == 'name') {
      newValue = value;
      prompt = !Name2Valid(newValue);
    } else if (id == 'power') {
      newValue = value;
      prompt = !Name2Valid(newValue);
    } else if (id == 'life') {
      newValue = value;
      prompt = !Name2Valid(newValue);
    } else if (id == 'manufacture') {
      newValue = value;
      prompt = !Name2Valid(newValue);
    } else { //描述
      newValue = value;
    }
    //输入框值变化后直接改变state中的值以及确定是否合法
    this.setState({ [id]: newValue, prompt: Object.assign({}, this.state.prompt, { [id]: prompt }) });
  }



  render() {
    let { name, description, power, life, manufacture, prompt } = this.state;
    const { idEdit = true } = this.props;
    let valid = prompt.name || prompt.description || prompt.power || prompt.life || prompt.manufacture;
    let footer = <PanelFooter funcNames={['onCancel', 'onConfirm']} btnTitles={['button.cancel', 'button.confirm']}
      btnClassName={['btn-default', 'btn-primary']}
      btnDisabled={[false, !name || valid]} onCancel={this.onCancel} onConfirm={this.onConfirm} />;

    return <div className="type-popup">
      <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel} >
        <div className="popup-left">
          <div className="form-group row">
            <label className="fixed-width-left control-label" htmlFor="name">{'型号：'}</label>
            <div className="fixed-width-right">
              <input type="text" className={'form-control '} id="name" placeholder={intlFormat({ en: 'please input the typename', zh: '输入型号' })} maxLength="16" value={name}
                onChange={this.onChange} disabled={!idEdit} />
              <span className={prompt.name ? 'prompt ' : 'prompt hidden'}>{intlFormat({ en: 'illegal', zh: '请输入设备型号' })}</span>
            </div>
          </div>
          <div className="form-group row">
            <label className="fixed-width-left control-label " htmlFor="power">{'功率:'}</label>
            <div className="fixed-width-right">
              <input type="email" className={'form-control '} id="power" placeholder={intlFormat({ en: 'please input the power', zh: '输入功率' })} value={power}
                onChange={this.onChange} />
              <span className={prompt.power ? 'prompt ' : 'prompt hidden'}>{intlFormat({ en: 'illegal', zh: '请输入功率' })}</span>
            </div>
          </div>
          <div className="form-group row">
            <label className="fixed-width-left control-label " htmlFor="life">{'使用寿命:'}</label>
            <div className="fixed-width-right">
              <input type="email" className={'form-control '} id="life" placeholder={intlFormat({ en: 'please input the serviceLife', zh: '输入使用寿命' })} value={life}
                onChange={this.onChange} />
              <span className={prompt.life ? 'prompt ' : 'prompt hidden'}>{intlFormat({ en: 'illegal', zh: '请输入使用寿命' })}</span>
            </div>
          </div>
          <div className="form-group row">
            <label className="fixed-width-left control-label " htmlFor="manufacture">{'厂商:'}</label>
            <div className="fixed-width-right">
              <input type="email" className={'form-control '} id="manufacture" placeholder={intlFormat({ en: 'please input the manufacturer', zh: '输入厂商' })} value={manufacture}
                onChange={this.onChange} />
              <span className={prompt.manufacture ? 'prompt ' : 'prompt hidden'}>{intlFormat({ en: 'illegal', zh: '请输入厂商' })}</span>
            </div>
          </div>
          <div className="form-group row">
            <label className="fixed-width-left control-label " htmlFor="description">{'描述:'}</label>
            <div className="fixed-width-right">
              <input type="email" className={'form-control '} id="description" placeholder={intlFormat({ en: 'please input the description', zh: '输入描述' })} value={description}
                onChange={this.onChange} />
              {/* <span className={prompt.detail ? 'prompt ' : 'prompt hidden'}>{intlFormat({en:'illegal', zh:'请输入描述'})}</span> */}
            </div>
          </div>
          {footer}
        </div>
      </Panel>
    </div>;
  }
}
