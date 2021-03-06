/**
 * Created by a on 2017/11/20.
 */
import React,{ PureComponent } from 'react';

import { NameValid } from '../../util/index';

import { FormattedMessage, injectIntl } from 'react-intl';

class PlayerProject extends PureComponent{
    constructor(props){
        super(props);
        let id = undefined;
        let name = "";
        if(props.data){
            id = props.data.id;
            name = props.data.name;
        }
        this.state = {
            id: id,
            property: {
                //方案
                project: { key: "project", title: this.props.intl.formatMessage({id:'mediaPublish.schemeName'}),
                    placeholder:this.props.intl.formatMessage({id:'mediaPublish.inputSchemeName'}), defaultValue: name, value: name }
            },
            prompt: {
                //方案
                project: name?false:true,
            }
        }

        this.onChange = this.onChange.bind(this);
        this.projectClick = this.projectClick.bind(this);
    }
    componentWillMount(){
        this.mounted = true;
        this.init();
    }

    componentDidUpdate(){
        this.init();
    }

    componentWillUnmount(){
        this.mounted = false;
    }
    init(){
        const {data} = this.props;
        if(!data || !data.id || data.id == this.state.id){
            return false;
        }

        this.state.property.project.defaultValue = this.state.property.project.value = data.name;
        this.mounted && this.setState({id: data.id, property: Object.assign({}, this.state.property),
            prompt: {sceneName:data.name?false:true}})
    }

    projectClick(id) {
        switch (id) {
            case "apply":
                this.props.applyClick && this.props.applyClick({
                    id : this.props.data.id,
                    name:this.state.property.project.value
                });
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
                    <div className="input-container input-w-1">
                        <input type="text" className={"form-control "}
                               placeholder={property.project.placeholder} maxLength="16"
                               value={property.project.value}
                               onChange={event => this.onChange("project", event)} />
                        <span className={prompt.project ? "prompt " : "prompt hidden"}><FormattedMessage id='mediaPublish.check'/></span>
                    </div>
                </div>
            </div>
            <div className="row line"/>
            <div className="row">
                <button className="btn btn-primary pull-right" onClick={() => { this.projectClick('apply') }}><FormattedMessage id='mediaPublish.apply'/></button>
                <button className="btn btn-gray margin-right-1 pull-right" onClick={() => { this.projectClick('reset') }}><FormattedMessage id='mediaPublish.reset'/></button>
            </div>
        </div>
    }
}

export default injectIntl(PlayerProject)