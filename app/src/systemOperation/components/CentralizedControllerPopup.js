import React, { Component } from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import Select from '../../components/Select.1';
import MapView from '../../components/MapView';
import PropTypes from 'prop-types';

import { Name2Valid, latlngValid, lngValid, latValid, MACValid } from '../../util/index'
export default class CentralizedControllerPopup extends Component {
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
        if (this.props.model === "screen") {
            return null
        }
        return <div className="form-group clearfix">
                 <label htmlFor="model" className="col-sm-4 control-label">型号：</label>
                 <div className="col-sm-7">
                   <Select id="model" className="form-control" titleField={ this.props.modelList.titleField } valueField={ this.props.modelList.valueField } options={ this.props.modelList.options } value={ this.state.model }
                     onChange={ this.onChange } />
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
        let valid = prompt.id || prompt.name || !domainList || !domainList.options.length || prompt.lng || prompt.lat;

        const footer = <PanelFooter funcNames={ ['onCancel', 'onConfirm'] } btnTitles={ ['取消', '确认'] } btnClassName={ ['btn-default', 'btn-primary'] } btnDisabled={ [false, valid] } onCancel={ this.onCancel }
                         onConfirm={ this.onConfirm } />;
        return (
            <div className={ className }>
              <Panel title={ title } closeBtn={ true } closeClick={ this.onCancel }>
                <div className="popup-left">
                  <div className="form-group clearfix">
                    <label htmlFor="id" className="col-sm-4 control-label">设备编号：</label>
                    <div className="col-sm-7">
                      <input type="text" className="form-control" id="id" placeholder="id" value={ id } maxLength={ 16 } onChange={ this.onChange } disabled={ popId == 'edit' ? true : false }
                      />
                      <span className={ prompt.id ? "prompt " : "prompt hidden" }>{ "不合法" }</span>
                    </div>
                  </div>
                  <div className="form-group clearfix">
                    <label htmlFor="name" className="col-sm-4 control-label">名称：</label>
                    <div className="col-sm-7">
                      <input type="text" className="form-control" id="name" placeholder="name" value={ name } maxLength={ 16 } onChange={ this.onChange }
                      />
                      <span className={ prompt.name ? "prompt " : "prompt hidden" }>{ "不合法" }</span>
                    </div>
                  </div>
                  { this.renderHtmlForModel() }
                  <div className="form-group clearfix">
                    <label htmlFor="domain" className="col-sm-4 control-label">域：</label>
                    <div className="col-sm-7">
                      <Select id="domain" className="form-control" titleField={ domainList.titleField } valueField={ domainList.valueField } options={ domainList.options } value={ domain }
                        onChange={ this.onChange } />
                      <span className={ !domainList || !domainList.options || domainList.options.length == 0 ? "prompt" : "prompt hidden" }>{ "请添加域" }</span>
                    </div>
                  </div>
                  <div className="form-group clearfix">
                    <label htmlFor="lng" className="col-sm-4 control-label">经度：</label>
                    <div className="col-sm-7">
                      <input type="text" className="form-control" id="lng" placeholder="lng" value={ lng } onChange={ this.onChange } />
                      <span className={ prompt.lng ? "prompt " : "prompt hidden" }>{ "经度数不合法" }</span>
                    </div>
                  </div>
                  <div className="form-group clearfix">
                    <label htmlFor="lat" className="col-sm-4 control-label">纬度：</label>
                    <div className="col-sm-7">
                      <input type="text" className="form-control" id="lat" placeholder="lat" value={ lat } onChange={ this.onChange } />
                      <span className={ prompt.lat ? "prompt " : "prompt hidden" }>{ "纬度数不合法" }</span>
                    </div>
                  </div>
                  { footer }
                </div>
                <div className="popup-map">
                  <MapView option={ { mapZoom: false } } mapData={ { id: "CentralizedPopup", latlng: { lng: lng, lat: lat },
 position: [{ "device_id": id, "device_type": "DEVICE", lng: lng, lat: lat }], data: [{ id: id, name: name }] } } mapCallFun={ { mapDragendHandler: this.mapDragend } } />
                </div>
              </Panel>
            </div>
        )
    }
}

CentralizedControllerPopup.propTypes = {
    popId: PropTypes.string.isRequired
}
