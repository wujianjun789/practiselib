import React, {Component} from 'react';
import Panel from './Panel';
import PanelFooter from './PanelFooter'


export default class AddDomainPopup extends Component {
    constructor(props) {
        super(props);
        const {domainName, lat, lng, prevDomain} = this.props.data;
        this.state = {
            domainName: domainName,
            lng: lng,
            lat: lat,
            prevDomain: prevDomain
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

onChange(e){
   let id = e.target.id;
   this.setState({[id]: e.target.value}); 
}


    render() {
         let {domainName, lng, lat, prevDomain} = this.state;
         let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','保存']} 
            btnClassName={['btn-default', 'btn-primary']} 
            btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return <div className="domain-popup">
            <Panel className="panel-default" title="添加域" closeBtn={true} footer={footer} closeClick={this.onCancel}  >
                <div className="row">
                    <div className="col-sm-6 popup-left">
                           <div className="form-group row">
                                <label className="col-sm-3 control-label" htmlFor="domainName">域名称</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" id="domainName" value={domainName} onChange={this.onChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 control-label " htmlFor="lng">经度</label>
                                <div className="col-sm-9">
                                    <input type="email" className="form-control" id="lng" value={lng} onChange={this.onChange}/>
                                </div>
                            </div> 
                            <div className="form-group row">   
                                <label className="col-sm-3 control-label" htmlFor="lat">纬度</label>
                                <div className="col-sm-9">
                                    <input type="email" className="form-control" id="lat" value={lat} onChange={this.onChange}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 control-label" htmlFor="prevDomain">上级域</label>
                                <div className="col-sm-9">
                                    <select className="form-control" id="prevDomain" value={prevDomain} onChange={this.onChange}>
                                        {
                                            this.props.domainList.map((item, index) => {
                                                return <option key={item.id} value={item.value}>{item.title}</option>;
                                            })
                                        }

                                    </select>
                                </div>
                            </div>
                            
                    </div>
                    <div className="col-sm-6 popup-map">右侧地图区域</div>
                </div>
            </Panel>
        </div>
        
    }
}