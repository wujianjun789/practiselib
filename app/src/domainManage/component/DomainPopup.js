import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Panel from './../../components/Panel';
import PanelFooter from './../../components/PanelFooter';

import NotifyPopup from '../../common/containers/NotifyPopup'
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

import MapView from './../../components/MapView'

import {Name2Valid, latlngValid, lngValid, latValid} from '../../util/index'
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
            prevDomain: prevDomain?prevDomain:(curDomain?curDomain.id:""),
            prompt:{
                domainName:!Boolean(domainName),
                lng: !Boolean(lng),
                lat: !Boolean(lat)
            }
        }
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.mapDragend = this.mapDragend.bind(this);
    }

    componentWillMount(){
        this.mounted = false;
    }

    componentWillUnmout(){
        this.mounted = true;
    }

    onConfirm() {
        this.props.onConfirm && this.props.onConfirm(this.state);
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
        let prompt = false
        if(id == "lat" ){
            newValue = value;
            if(!latlngValid(newValue) || !latValid(newValue)){
                prompt = true;
            }
        }else if(id== "lng"){
            newValue = value;
            if(!latlngValid(newValue) || !lngValid(newValue)){
                prompt = true
            }
        }else if(id == "domainName"){
            newValue = value;
            prompt = !Name2Valid(newValue);
        }else{
            newValue = value;
        }

        this.setState({[id]: newValue, prompt:Object.assign({}, this.state.prompt, {[id]:prompt})});
    }

    mapDragend(data){
        for(let key in data.latlng){
            let value = data.latlng[key];
            let newValue = value;
            let prompt = Object.assign({}, this.state.prompt, {[key]:false});
            this.setState({[key]:newValue, prompt:prompt});
        }
    }

    render() {
         let {domainId, domainName, lng, lat, prevDomain, prompt} = this.state;
         let {titleKey, valueKey, options} = this.props.domainList;

        let valid = prompt.domainName || prompt.lng || prompt.lat;

         let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']}
            btnClassName={['btn-default', 'btn-primary']} 
            btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
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
                    <div className="col-sm-6 col-xs-6 popup-left">
                        <div className="form-group row">
                            <label className="fixed-width-left control-label" htmlFor="domainName">域名称：</label>
                            <div className="fixed-width-right">
                                <input type="text" className={ "form-control " } id="domainName" placeholder="输入域名称" maxLength="16" value={domainName}
                                       onChange={this.onChange}/>
                                <span className={prompt.domainName?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="fixed-width-left control-label " htmlFor="lng">经　度：</label>
                            <div className="fixed-width-right">
                                <input type="email" className={ "form-control " } id="lng" placeholder="输入GPS坐标" value={lng}
                                        onChange={this.onChange}/>
                                <span className={prompt.lng?"prompt ":"prompt hidden"}>{"经度数不合法"}</span>
                            </div>
                        </div> 
                        <div className="form-group row">   
                            <label className="fixed-width-left control-label" htmlFor="lat">纬　度：</label>
                            <div className="fixed-width-right">
                                <input type="email" className={ "form-control " } id="lat" placeholder="输入GPS坐标" value={lat} onChange={this.onChange}/>
                                <span className={prompt.lat?"prompt ":"prompt hidden"}>{"纬度数不合法"}</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="fixed-width-left control-label" htmlFor="prevDomain">上级域：</label>
                            <div className="fixed-width-right">
                                <select className="form-control" id="prevDomain" placeholder="选择上级域" value={curDomain?curDomain.name:"无"} onChange={this.onChange}>
                                    {
                                        options.map(item => <option key={item.id} value={item[valueKey]}>{item[titleKey]}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                        {footer}
                    </div>
                    <div className="col-sm-6 col-xs-6 popup-map">

                            <MapView option={{mapZoom:false, markerDraggable:true}} mapData={{id:"domainPopup",  latlng:{lng:lng, lat:lat},
                        position:[{"device_id":domainId, "device_type":"DEVICE",lng:lng, lat:lat}], data:[{id:domainId, name:domainName}]}}
                                     mapCallFun={{mapDragendHandler:this.mapDragend}} markerCallFun={{markerDragendHandler:this.mapDragend}}/>
                    </div>
                </div>
                <NotifyPopup />
            </Panel>
        </div>
    }
}

DomainPopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        domainName: PropTypes.string.isRequired,
        // lat: PropTypes.number.isRequired,
        // lng: PropTypes.number.isRequired,
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