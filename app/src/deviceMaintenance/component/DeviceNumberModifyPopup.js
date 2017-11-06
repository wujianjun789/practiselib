/**
 * Created by m on 2017/10/18.
 */
import React, { Component } from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import PropTypes from 'prop-types';

export default class DeviceNumberModifyPopup extends Component {
    constructor(props) {
        super(props);
        const { selectDeviceName="", selectDeviceId="", title=""} = props.data;
        this.state = {
            title: title,
            deviceName: selectDeviceName,
            deviceId: selectDeviceId,
            deviceIdNew:'', 
            numberValid: true
        };

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this)
    }

    onChange(e) {
        let id = e.target.id;
        let value = e.target.vlaue;
        if (id == "deviceId") {
            this.setState({
                deviceId: value,
                deviceIdNew: value
            })
        }
    }

    onCancel() {
        this.props.overlayerHide();
    }
    
    onConfirm() {
        this.props.overlayerHide();
        this.props.onConfirm && this.props.onConfirm(this.state.deviceId,this.state.deviceIdNew);
    }

    render() {
        const { title, deviceName, deviceId, numberValid } = this.state;
        const {selectDevice, className} = this.props;
        let valid = numberValid;

        const footer = <PanelFooter funcNames={ ['onCancel', 'onConfirm'] } btnTitles={['取消', '确认']}
            btnClassName={['btn-default' ,'btn-primary']} btnDisabled={ [false, false] } onCancel={this.onCancel} 
            onConfirm={ this.onConfirm }/>;
        return (
            <div className={className} >
                <Panel title={title} closeBtn={ true } closeClick={ this.onCancel } footer={footer}>

                    <div className="form-group clearfix">
                        <label htmlFor="name" className="control-label">名称：</label>
                        <div className="name-content">
                            <input type="text" className={ "form-control " } id="name" placeholder="name" value={ selectDevice.data[0].name } 
                            maxLength={ 16 } onChange={ this.onChange } disabled={ valid ? true : false }/>
                            {/* <span className={ prompt.name ? "prompt " : "prompt hidden" }>{ "不合法" }</span> */}
                        </div>
                    </div>
                    <div className="form-group clearfix">
                        <label htmlFor="number" className="control-label">设备编号：</label>
                        <div className="number-content">
                            <input type="text" className={ "form-control " } id="deviceId" placeholder="id" value={ deviceId } 
                            maxLength={ 16 } onChange={ this.onChange }/>
                            {/* <span className={ prompt.id ? "prompt " : "prompt hidden" }>{ "不合法" }</span> */}
                        </div>
                    </div>
                </Panel>
            </div>
        )
    }
}