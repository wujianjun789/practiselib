import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Panel from './Panel';
import PanelFooter from './PanelFooter';
/**
 * Domain component
 * @param {String}      title       'domain title,
 * @param {Object}      data        'domain data,  example:{domainName:"域名", lng:35, lat: 65, prevDomain: "上级域"}　'
 * @param {Object}      domainList  
 * @param {String}      domainList.titileKey 
 * @param {String}      domainList.vlaueKey  
 * @param {Array}       domainList.options     'example:[{id:0, value:"上级域1", title:"上级域1"}]'
 * @param {Func}        onConfirm   'panel save button handler'
 * @param {Func}        onCancel    'panel close button handler'
 * 
 */

import MapView from './MapView'

import {latlngValid} from '../util/index'
export default class DomainPopup extends PureComponent {
    constructor(props) {
        super(props);
        const {domainId, domainName, lat, lng, prevDomain} = this.props.data;
        let {options} = this.props.domainList;
        let curDomain = options && options.length ? options[0]:null
        this.state = {
            domainId: domainId,
            domainName: domainName,
            lng: lng,
            lat: lat,
            prevDomain: prevDomain?prevDomain:(curDomain?curDomain.id:"")
        }
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onConfirm() {
        this.props.onConfirm(this.state);
    }

    onCancel() {
        this.props.onCancel();
    }

    onChange(e) {
        let id = e.target.id;

        if(id=="prevDomain"){
            const {options} = this.props.domainList;
            let curIndex = e.target.selectedIndex;
            this.setState({[id]:options[curIndex].id});
            return
        }
        let value = e.target.value;
        let newValue='';
        if(id == "lat" || id == "lng"){
            for(let i=0;i<value.length;i++)
            {
                let s = value.slice(i, i+1);
                if(latlngValid(s)){
                    newValue += s;
                }
            }

            newValue = Number(newValue);

        }else{
            newValue = value;
        }
        this.setState({[id]: newValue});
    }

    render() {
         let {domainId, domainName, lng, lat, prevDomain} = this.state;
         let {titleKey, valueKey, options} = this.props.domainList;
         let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','保存']} 
            btnClassName={['btn-default', 'btn-primary']} 
            btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        let curDomain = null;
        for(let key in options){
            if(options[key].id == prevDomain){
                curDomain = options[key];
                break;
            }
        }

        return <div className="domain-popup">
            <Panel title={this.props.title} closeBtn={true} closeClick={this.onCancel} >
                <div className="row">
                    <div className="col-sm-6 popup-left">
                        <div className="form-group row">
                            <label className="col-sm-3 control-label" htmlFor="domainName">域名称：</label>
                            <div className="col-sm-9">
                                <input type="text" className="form-control" id="domainName" placeholder="输入域名称" value={domainName} onChange={this.onChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 control-label " htmlFor="lng">经度：</label>
                            <div className="col-sm-9">
                                <input type="email" className="form-control" id="lng" placeholder="输入GPS坐标" value={lng}
                                        onChange={this.onChange}/>
                            </div>
                        </div> 
                        <div className="form-group row">   
                            <label className="col-sm-3 control-label" htmlFor="lat">纬度：</label>
                            <div className="col-sm-9">
                                <input type="email" className="form-control" id="lat" placeholder="输入GPS坐标" value={lat} onChange={this.onChange}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 control-label" htmlFor="prevDomain">上级域：</label>
                            <div className="col-sm-9">
                                <select className="form-control" id="prevDomain" placeholder="选择上级域" value={curDomain.name} onChange={this.onChange}>
                                    {
                                        options.map(item => <option key={item.id} value={item[valueKey]}>{item[titleKey]}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                        {footer}
                    </div>
                    <div className="col-sm-6 popup-map">
                        {
                            lng && lat ? <MapView option={{mapZoom:false}} mapData={{id:"domainPopup",  latlng:{lng:lng, lat:lat},
                        position:[{"device_id":domainId, "device_type":"DEVICE",lng:lng, lat:lat}], data:[{id:domainId, name:domainName}]}}/>
                        :''}
                    </div>
                </div>
            </Panel>
        </div>
    }
}

DomainPopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        domainName: PropTypes.string.isRequired,
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        prevDomain: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired
    }).isRequired,
    domainList: PropTypes.shape({
        titleKey: PropTypes.string.isRequired,
        valueKey: PropTypes.string.isRequired,
        options: PropTypes.array.isRequired
    }).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}