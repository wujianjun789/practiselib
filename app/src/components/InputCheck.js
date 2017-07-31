import React,{Component} from 'react';
export default class InputCheck extends Component{
    constructor(props){
        super(props)
        this.state = {
            style: { visibility: 'hidden' },
        }
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onFocus(){
        this.setState({style:{visibility: 'hidden'}})
    }

    onBlur(event){
        this.props.onBlur && this.props.onBlur(event.target.id);
        this.setState({style:{visibility: 'visible'}});
    }

    onChange(event){
        this.props.onChange && this.props.onChange(event.target.id,event.target.value);
    }

    render(){
        const {type = 'text',className = 'userName',label = '用户名',checked = 'fail',reminder = '',placeholder = '请输入用户名',value=''} = this.props;
        const style = this.state.style?this.state.style:{ visibility: 'hidden' };

        return <div className={"inputCheck "+className}>
                <label className = 'col-sm-2 control-label'>{label}:</label>
                <div className = {`has-feedback col-sm-4 ${checked=='success'?'has-success':checked=='fail'?'has-error':''}`}>
                    <input type={type} id = {className} className="form-control" placeholder={placeholder} value={value} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange}/>
                    <span className={`glyphicon ${checked=='success'?'glyphicon-ok':checked=='fail'?'glyphicon-remove':''} form-control-feedback`} aria-hidden="true"></span>
                    <span className="reminder" style={style}>{reminder}</span>
                </div>
            </div>
        
    }
}
