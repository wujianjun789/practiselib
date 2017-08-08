import React, {Component} from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import Select from '../../components/Select.1';
import MapView from '../../components/MapView';
import PropTypes from 'prop-types';

import {ObjectPerValid, Name2Valid, latlngValid, MACValid} from '../../util/index'
export default class CentralizedControllerPopup extends Component {
    constructor(props) {
        super(props);
        const {id="", name="", modelId="", model="", domainId="", domain="", lng=0, lat=0} = props.data;
        this.state = {
            id:id,
            name:name,
            model:model,
            modelId:modelId,
            domain:domain,
            domainId:domainId,
            lng:lng,
            lat:lat
        };

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);

        this.mapDragend = this.mapDragend.bind(this);
    }

    onChange(e) {
        let id = e.target.id;
        if (id == "model") {
            this.setState({modelId: this.props.modelList.options[e.target.selectedIndex].id});
        }

        if (id == "domain") {
            this.setState({modelId: this.props.domainList.options[e.target.selectedIndex].id});
        }

        let value = e.target.value;
        let newValue='';
        if(id == "lat" || id == "lng"){
            newValue = Number(ObjectPerValid(value, latlngValid));
        }else if(id == "name"){
            newValue = ObjectPerValid(value, Name2Valid);
        }else if(id == "id") {
            newValue = ObjectPerValid(value, MACValid)
        }
        else{
            newValue = value;
        }

        this.setState({[id]: newValue});
    }

    onCancel() {
        this.props.overlayerHide();
    }

    onConfirm() {
        this.props.onConfirm && this.props.onConfirm(this.state);
        // this.props.overlayerHide();
    }

    mapDragend(data) {
        for(let key in data.latlng){
            let value = data.latlng[key];
            let newValue = Number(ObjectPerValid(""+value, latlngValid), latlngValid);
            this.setState({[key]:newValue});
        }
    }

    render() {
        const {className, title, domainList, modelList, popId} = this.props;
        const {id, name, model, domain, lng, lat} = this.state;
        const footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']}
                                  btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]}
                                  onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <div className={className}>
                <Panel title={title} closeBtn={true} closeClick={this.onCancel}>
                    <div className="popup-left">
                        <div className="form-group clearfix">
                            <label htmlFor="id" className="col-sm-4 control-label">设备编号：</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="id" placeholder="id" value={id}
                                       onChange={this.onChange} disabled={popId=='edit'?true:false}/>
                            </div>
                        </div>
                        <div className="form-group clearfix">
                            <label htmlFor="name" className="col-sm-4 control-label">名称：</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="name" placeholder="name" value={name}
                                       onChange={this.onChange}/>
                            </div>
                        </div>
                        <div className="form-group clearfix">
                            <label htmlFor="model" className="col-sm-4 control-label">型号：</label>
                            <div className="col-sm-8">
                                <Select id="model" className="form-control" titleField={modelList.titleField}
                                        valueField={modelList.valueField} options={modelList.options} value={model}
                                        onChange={this.onChange}/>
                            </div>
                        </div>
                        <div className="form-group clearfix">
                            <label htmlFor="domain" className="col-sm-4 control-label">域：</label>
                            <div className="col-sm-8">
                                <Select id="domain" className="form-control" titleField={domainList.titleField}
                                        valueField={domainList.valueField} options={domainList.options} value={domain}
                                        onChange={this.onChange}/>
                            </div>
                        </div>
                        <div className="form-group clearfix">
                            <label htmlFor="lng" className="col-sm-4 control-label">经度：</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="lng" placeholder="lng" value={lng}
                                       onChange={this.onChange}/>
                            </div>
                        </div>
                        <div className="form-group clearfix">
                            <label htmlFor="lat" className="col-sm-4 control-label">纬度：</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="lat" placeholder="lat" value={lat}
                                       onChange={this.onChange}/>
                            </div>
                        </div>
                        {footer}
                    </div>
                    <div className="popup-map">
                        <MapView option={{mapZoom: false }} mapData={{id: "CentralizedPopup", latlng:{lng:lng, lat:lat},
                            position: [ {"device_id": id, "device_type": "DEVICE", lng: lng, lat: lat } ], data: [ { id: id, name: name } ] } }
                                 mapCallFun={{mapDragendHandler:this.mapDragend}} />
                    </div>
                </Panel>
            </div>
        )
    }
}

CentralizedControllerPopup.propTypes = {
    popId: PropTypes.string.isRequired
}
