import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Panel from './../../components/Panel';
import PanelFooter from './../../components/PanelFooter';

import NotifyPopup from '../../common/containers/NotifyPopup'

import {Name2Valid, numbersValid} from '../../util/index'
import { FormattedMessage, injectIntl } from 'react-intl';
export default class PlayerListPopup extends PureComponent {
    constructor(props) {
        super(props);
        const {playerId, playerName, width, height} = this.props.data;

        this.state = {
            playerId: playerId,
            playerName: playerName,
            width: width,
            height: height,

            prompt: {
                playerName: !Boolean(playerName),
                width: !Boolean(width),
                height: !Boolean(height)
            }
        }
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
        this.props.onConfirm && this.props.onConfirm(this.state);
    }

    onCancel() {
        this.props.onCancel();
    }

    onChange(e) {
        const id = e.target.id;
        let prompt = false;
        let newValue = e.target.value;
        if(id == "playerName"){
            if(!Name2Valid(newValue)){
                prompt = true;
            }
        }else{
            if(!numbersValid(newValue)){
                prompt = true;
            }
        }

        this.setState({[id]: newValue, prompt: Object.assign({}, this.state.prompt, {[id]: prompt})});
    }

    render() {
        let {playerId, playerName, width, height, prompt} = this.state;

        let valid = prompt.playerName || prompt.width || prompt.height;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={[this.props.intl.formatMessage({id:'button.cancel'}),this.props.intl.formatMessage({id:'button.confirm'})]}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <div className="playerList-popup">
            <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel}>
                <div className="row">
                    <div className="form-group row">
                        <label className="col-sm-3 control-label" htmlFor="playerName"><FormattedMessage id='mediaPublish.planName' /></label>
                        <div className="col-sm-9">
                            <input type="text" className={ "form-control " } id="playerName" placeholder={this.props.intl.formatMessage({id:'mediaPublish.inputPlanName'})}
                                   maxLength="16" value={playerName} onChange={this.onChange}/>
                            <span className={prompt.playerName?"prompt ":"prompt hidden"}><FormattedMessage id='mediaPublish.prompt'/></span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 control-label" htmlFor="screen-size"><FormattedMessage id='mediaPublish.screenSize'/></label>
                        <div className="col-sm-4">
                            <input type="text" className={ "form-control " } id="width" placeholder="输入屏幕宽度" value={width} onChange={this.onChange}/>
                            <span className={prompt.width?"prompt ":"prompt hidden"}>{"屏幕宽度不合法"}</span>
                        </div>
                        <div className="col-sm-1">&times;</div>
                        <div className="col-sm-4">
                            <input type="text" className={ "form-control " } id="height" placeholder="输入屏幕高度" value={height} onChange={this.onChange}/>
                            <span className={prompt.height?"prompt ":"prompt hidden"}>{"屏幕高度不合法"}</span>
                        </div>
                    </div>
                    {footer}
                </div>
                <NotifyPopup />
            </Panel>
        </div>
    }
}

PlayerListPopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        playerName: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    }).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}