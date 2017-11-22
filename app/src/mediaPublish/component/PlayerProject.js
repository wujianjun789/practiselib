/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import { NameValid } from '../../util/index';
export default class PlayerProject extends PureComponent{
    constructor(props){
        super(props);
        const {name=""} = props;
        this.state = {
            property: {
                //方案
                project: { key: "project", title: "方案名称", placeholder: "请输入名称", defaultValue: name, value: name }
            },
            prompt: {
                //方案
                project: name?false:true,
            }
        }

        this.onChange = this.onChange.bind(this);
        this.projectClick = this.projectClick.bind(this);
    }

    projectClick(id) {
        switch (id) {
            case "apply":
                break;
            case "reset":
                const defaultValue = this.state.property.project.defaultValue;
                this.setState({property:Object.assign({}, this.state.property,
                    {project:Object.assign({}, this.state.property.project, {value:defaultValue})}),
                prompt:{project:defaultValue?false:true}});
                break;
        }
    }

    onChange(id, value) {
        console.log("id:", id);
        let prompt = false;

        const val = value.target.value;
        if (!NameValid(val)) {
            prompt = true;
        }

        this.setState({
            property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
            prompt: Object.assign({}, this.state.prompt, { [id]: prompt })
        })

    }

    render(){
        const {property, prompt} = this.state;
        return <div className={"pro-container playerProject "}>
            <div className="row">
                <div className="form-group project-name">
                    <label className="control-label"
                           htmlFor={property.project.key}>{property.project.title}</label>
                    <div className="input-container">
                        <input type="text" className={"form-control "}
                               placeholder={property.project.placeholder} maxLength="16"
                               value={property.project.value}
                               onChange={event => this.onChange("project", event)} />
                        <span className={prompt.project ? "prompt " : "prompt hidden"}>{"请输入名称"}</span>
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.projectClick('apply') }}>应用</button>
                <button className="btn btn-gray pull-right" onClick={() => { this.projectClick('reset') }}>重置</button>
            </div>
        </div>
    }
}