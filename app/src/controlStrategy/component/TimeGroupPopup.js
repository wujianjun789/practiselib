import React, {Component} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import {Name2Valid} from '../../util/index';

export default class TimeGroupPopup extends Component {
  constructor(props) {
    super(props);
    const {name = ''} = this.props;
    this.state = {
      name:name,
      prompt:false,
    };
  }

    formatIntl=(formatId) => {
      const {intl} = this.props;
      return intl ? intl.formatMessage({id:formatId}) : null;
    }

    onCancel=() => {
      this.props.onCancel && this.props.onCancel();

    }

    onConfirm=() => {
      this.props.onConfirm && this.props.onConfirm(this.state.name);
    }

    onChange=(e) => {
      let prompt = !Name2Valid(e.target.value);
      this.setState({name:e.target.value, prompt:prompt});
    }

    render() {
      let {className = '', title = ''} = this.props;
      let {name, prompt} = this.state;
      const valid = !prompt && name;
      let footer = <PanelFooter funcNames={['onCancel', 'onConfirm']} btnTitles={['button.cancel', 'button.confirm']}
        btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, !valid]}
        onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
      return (
        <Panel className={className} title={title} footer={footer} closeBtn={true} closeClick={this.onCancel}>
          <div className="form-group">
            <label className="control-label" htmlFor="name" title={this.formatIntl('app.strategy.group.name')}>
              {this.formatIntl('app.strategy.group.name')}</label>
            <div className="input-container">
              <input type="text" className="form-control" id="name" value={name} onChange={this.onChange}/>
              <span className={prompt ? 'prompt ' : 'prompt hidden'}>{this.formatIntl('mediaPublish.prompt')}</span>
            </div>
          </div>
        </Panel>
      );
    }
}