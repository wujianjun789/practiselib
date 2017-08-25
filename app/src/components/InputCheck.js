import React,{PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class InputCheck extends PureComponent{
    constructor(props){
        super(props)
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onFocus(event){
        this.props.onFocus && this.props.onFocus(event.target.id);
    }

    onBlur(event){
        this.props.onBlur && this.props.onBlur(event.target.id);
    }

    onChange(event){
        this.props.onChange && this.props.onChange(event);
    }

    render(){
        const {type = 'text',className = '',id,label,checked = 'fail',reminder = '',placeholder = '',value='',disabled=false} = this.props;

        return <div className={`inputCheck ${className}`}>
                <label className = 'col-sm-4 control-label'>{label}:</label>
                <div className = {`has-feedback col-sm-8 ${checked=='success'?'has-success':checked=='fail'?'has-error':''}`}>
                    <input disabled={!!disabled} type={type} id = {id} className="form-control" placeholder={placeholder} value={value} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange}/>
                    <span className={`glyphicon ${checked=='success'?'glyphicon-ok':checked=='fail'?'glyphicon-remove':''} form-control-feedback`} aria-hidden="true"></span>
                    <span className="reminder">{reminder}</span>
                </div>
            </div>
        
    }
}

InputCheck.PropTypes = {
    id: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.arrayOf(PropTypes.string).isRequired,
    disabled: PropTypes.arrayOf(PropTypes.bool),
}
