/**
 * Created by mx on 2017/9/12.
 * systemOperation/systemConfig/scene/SceneControllerPopup;
 */

import React, { Component } from 'react';
// import Panel from '../../components/Panel';
import Panel from '../../components/Panel';
// import PanelFooter from '../../components/PanelFooter';
import PanelFooter from '../../components/PanelFooter';
// import Select from '../../components/Select.1';
import Select from '../../components/Select.1';
import MapView from '../../components/MapView';
import PropTypes from 'prop-types';

import { Name2Valid, latlngValid, lngValid, latValid, MACValid } from '../../util/index'
export default class SceneControllerPopup extends Component {
    constructor(props) {
        super(props);
        const {id="", name="", modelId="", model="", domainId="", domain="", lng=0, lat=0} = props.data;
        this.state = {
            id: id,
            name: name,
            model: model,
            modelId: modelId,
            domain: domain,
            domainId: domainId,
            lng: lng,
            lat: lat,
            prompt: {
                // domainName:false,
                lng: false,
                lat: false,
                name: false,
                id: false
            }
        };

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.mapDragend = this.mapDragend.bind(this);
        this.renderHtmlForModel = this.renderHtmlForModel.bind(this);
    }

    onChange(e) {
        let id = e.target.id;
        if (id == "model") {
            this.setState({
                modelId: this.props.modelList.options[e.target.selectedIndex].id
            });
        }

        if (id == "domain") {
            this.setState({
                domainId: this.props.domainList.options[e.target.selectedIndex].id
            });
        }

        let value = e.target.value;
        let newValue = '';
        let prompt = false;
        if (id == "lat") {
            newValue = value;
            if (!latlngValid || !latValid(newValue)) {
                prompt = true;
            }
        } else if (id == "lng") {
            newValue = value;
            if (!latlngValid || !lngValid(newValue)) {
                prompt = true;
            }
        } else if (id == "name") {
            newValue = value; //过滤非法数据
            prompt = !Name2Valid(newValue); //判定输入数量
        } else if (id == "id") {
            newValue = value;
            prompt = !MACValid(newValue);
        } else {
            newValue = value;
        }

        this.setState({
            [id]: newValue,
            prompt: Object.assign({}, this.state.prompt, {
                [id]: prompt
            })
        });

    }

    renderHtmlForModel() {

        return <div className="form-group clearfix">
                 <label htmlFor="model" className="fixed-width-left control-label">型号：</label>
                 <div className="fixed-width-right">
                   <Select id="model" className="form-control" titleField={ this.props.modelList.titleField } valueField={ this.props.modelList.valueField } options={ this.props.modelList.options } value={ this.state.model }
                     onChange={ this.onChange } disabled={this.props.model === "xes"&&this.props.popId=='edit'?true:false}/>
                 </div>
               </div>

    }

    onCancel() {
        this.props.overlayerHide();
    }

    onConfirm() {
        this.props.overlayerHide();
        this.props.onConfirm && this.props.onConfirm(this.state);
    }

    mapDragend(data) {
        for (let key in data.latlng) {
            let value = data.latlng[key];
            let newValue = value;
            this.setState({
                [key]: newValue,
                prompt: {
                    [key]: true
                }
            });
        }
    }

    render() {
        const {className, title, domainList, modelList, popId} = this.props;
        const {id, name, model, domain, lng, lat, prompt} = this.state;
        // let valid = '';
        let valid = false;
        const footer = <PanelFooter funcNames={ ['onCancel', 'onConfirm'] } btnTitles={ ['取消', '确认'] } btnClassName={ ['btn-default', 'btn-primary'] } btnDisabled={ [false, valid] } onCancel={ this.onCancel }
                         onConfirm={ this.onConfirm } />;
        return (
            <div className={ "scene-centralized-popup" }>
              <Panel title={ title } closeBtn={ true } closeClick={ this.onCancel } footer = {footer}>
                <div className="popup-top">
                    <div className="form-group clearfix">
                        <label htmlFor="id" className="fixed-width-left control-label">场景名称：</label>
                        <div className="fixed-width-right">
                            <input type="text" className="form-control" id="id" placeholder="场景1" value={ id } maxLength={ 16 } onChange={ this.onChange } disabled={ popId == 'edit' ? true : false }
                            />
                        <span className={"prompt"}>{ "场景名已使用/仅能使用字母、数字、或者下划线" }</span>
                        </div>
                    </div>
                </div>
                <div className="popup-body"> 
                    <div className="col-sm-6 col-xm-6 popup-body-left">
                         <Select id="road" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domainList.value } onChange={ this.domainSelect }/>
                        <div>
                         <Select id="device" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domainList.value } onChange={ this.domainSelect }/>
                         <button id="sys-add" className="btn btn-primary add-domain" onClick={ this.domainHandler }>添加</button>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xm-6 popup-body-right">
                        <div className="selectBox">
                         <label htmlFor="id" className="fixed-width-left control-label">控制模式</label>
                         <Select id="controlModal" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domainList.value } onChange={ this.domainSelect }/>
                        </div>
                        <div className="selectBox">
                         <label htmlFor="id" className="fixed-width-left control-label">调整参数</label>
                         <Select id="controlParam" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domainList.value } onChange={ this.domainSelect }/>
                        </div>
                    </div>
                </div> 
              </Panel>
            </div>
        )
    }
}

SceneControllerPopup.propTypes = {
    popId: PropTypes.string.isRequired
}
