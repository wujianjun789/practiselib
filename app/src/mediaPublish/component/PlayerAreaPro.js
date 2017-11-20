/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import { Name2Valid, numbersValid } from '../../util/index';
export default class PlayerAreaPro extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            property: {
                //区域
                areaName: { key: "areaName", title: "区域名称", placeholder: '区域名称', value: "" },
                width: { key: "width", title: "宽度", placeholder: '请输入宽度', value: "" },
                height: { key: "height", title: "高度", placeholder: '请输入高度', value: "" },
                axisX_a: { key: "axisX_a", title: "X轴", placeholder: '请输入X轴坐标', value: "" },
                axisY_a: { key: "axisY_a", title: "Y轴", placeholder: '请输入Y轴坐标', value: "" },
            },
            prompt: {
                //区域
                areaName: true, width: true, height: true, axisX_a: true, axisY_a: true,
            }
        }

        this.onChange = this.onChange.bind(this);
        this.playerAreaClick = this.playerAreaClick.bind(this);
    }

    playerAreaClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                break;
        }
    }

    onChange(id, value) {
        console.log("id:", id);
        let prompt = false;

        const val = value.target.value;
        if (id == "areaName") {
            if(!Name2Valid(val)){
                prompt = true;
            }
        }else{
            if(!numbersValid(val)){
                prompt = true;
            }
        }

        this.setState({
            property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
            prompt: Object.assign({}, this.state.prompt, { [id]: prompt })
        })

    }

    render(){
        const {property, prompt} = this.state;
        return <div className={"pro-container playerArea "}>
            <div className="form-group  area-name">
                <label className="control-label"
                       htmlFor={property.areaName.key}>{property.areaName.title}</label>
                <div className="input-container">
                    <input type="text" className={"form-control "}
                           placeholder={property.areaName.placeholder} maxLength="8"
                           value={property.areaName.value}
                           onChange={event => this.onChange("areaName", event)} />
                    <span className={prompt.areaName ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>

                </div>
            </div>
            <div className="form-group  width">
                <label className="col-sm-3 control-label"
                       htmlFor={property.width.key}>{property.width.title}</label>
                <div className="input-container">
                    <input type="text" className={"form-control "}
                           placeholder={property.width.placeholder} maxLength="8"
                           value={property.width.value}
                           onChange={event => this.onChange("width", event)} />
                    <span className={prompt.width ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                </div>
            </div>
            <div className="form-group  height">
                <label className="col-sm-3 control-label"
                       htmlFor={property.height.key}>{property.height.title}</label>
                <div className="input-container">
                    <input type="text" className={"form-control "}
                           placeholder={property.height.placeholder} maxLength="8"
                           value={property.height.value}
                           onChange={event => this.onChange("height", event)} />
                    <span className={prompt.height ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                </div>
            </div>
            <div className="form-group  axisX_a">
                <label className="col-sm-3 control-label"
                       htmlFor={property.axisX_a.key}>{property.axisX_a.title}</label>
                <div className="input-container">
                    <input type="text" className={"form-control "}
                           placeholder={property.axisX_a.placeholder} maxLength="8"
                           value={property.axisX_a.value}
                           onChange={event => this.onChange("axisX_a", event)} />
                    <span className={prompt.axisX_a ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                </div>
            </div>
            <div className="form-group  axisY_a">
                <label className="col-sm-3 control-label"
                       htmlFor={property.axisY_a.key}>{property.axisY_a.title}</label>
                <div className="input-container">
                    <input type="text" className={"form-control "}
                           placeholder={property.axisY_a.placeholder} maxLength="8"
                           value={property.axisY_a.value}
                           onChange={event => this.onChange("axisY_a", event)} />
                    <span className={prompt.axisY_a ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.playerAreaClick('apply') }}>应用</button>
                <button className="btn btn-gray pull-right" onClick={() => { this.playerAreaClick('reset') }}>重置</button>
            </div>
        </div>
    }
}