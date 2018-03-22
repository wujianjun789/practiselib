import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Panel from './../../components/Panel';
import PanelFooter from './../../components/PanelFooter';

import NotifyPopup from '../../common/containers/NotifyPopup';

import {Name2Valid, numbersValid} from '../../util/index';
import { FormattedMessage, injectIntl } from 'react-intl';
export default class PlayerListPopup extends PureComponent {
  constructor(props) {
    super(props);
    console.log('player:', this.props.data);
    const {id, name, width, height} = this.props.data;

    this.state = {
      id: id,
      name: name,
      width: width,
      height: height,

      prompt: {
        name: !name,
        width: !width,
        height: !height,
      },
    };
    this.formatIntl = this.formatIntl.bind(this);

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

  formatIntl(formatId) {
    const {intl} = this.props;
    return intl ? intl.formatMessage({id:formatId}) : null;
    // return formatId;
  }

  onConfirm() {
    this.props.onConfirm && this.props.onConfirm(this.state);
  }

  onCancel() {
    this.props.onCancel();
  }

  onChange(e) {
    const id = e.target.id;
    let prompt = false;
    let newValue = e.target.value;
    if (id == 'name') {
      if (!Name2Valid(newValue)) {
        prompt = true;
      }
    } else {
      if (!numbersValid(newValue)) {
        prompt = true;
      }
    }

    this.setState({[id]: newValue, prompt: Object.assign({}, this.state.prompt, {[id]: prompt})});
  }

  render() {
    const {id, name, width, height, prompt} = this.state;
    const {IsModify} = this.props;

    const valid = prompt.name || prompt.width || prompt.height;
    const footer = <PanelFooter funcNames={['onCancel', 'onConfirm']} btnTitles={['button.cancel', 'button.confirm']}
      btnClassName={['btn-default', 'btn-primary']}
      btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

    return <div className="playerList-popup">
      <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel}>
        <div className="row">
          <div className="form-group row">
            <label className="col-sm-3 control-label" htmlFor="name">
              <FormattedMessage id="mediaPublish.schemeName" />
            </label>
            <div className="col-sm-9">
              <input type="text" className={'form-control '} id="name"
                placeholder={this.formatIntl('mediaPublish.inputSchemeName')}
                maxLength="16" value={name} onChange={this.onChange}/>
              <span className={prompt.name ? 'prompt ' : 'prompt hidden'}>
                <FormattedMessage id="mediaPublish.prompt" />
              </span>
            </div>
          </div>
          <div className={"form-group row "+(IsModify?"hidden":"")}>
            <label className="col-sm-3 control-label" htmlFor="screen-size">
              <FormattedMessage id="mediaPublish.screenSize" />
            </label>
            <div className="col-sm-4">
              <input type="text" className={'form-control '} id="width"
                placeholder="输入屏幕宽度" value={width} onChange={this.onChange} />
              <span className={prompt.width ? 'prompt ' : 'prompt hidden'}>{'屏幕宽度不合法'}</span>
            </div>
            <div className="col-sm-1">&times;</div>
            <div className="col-sm-4">
              <input type="text" className={'form-control '} id="height"
                placeholder="输入屏幕高度" value={height} onChange={this.onChange} />
              <span className={prompt.height ? 'prompt ' : 'prompt hidden'}>{'屏幕高度不合法'}</span>
            </div>
          </div>
          {footer}
        </div>
        <NotifyPopup />
      </Panel>
    </div>;
  }
}

PlayerListPopup.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};