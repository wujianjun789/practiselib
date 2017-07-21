/**
 * Created by a on 2017/7/7.
 */
import React,{ Component } from 'react'
export default class SearchText extends Component{
    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onChange(event) {
        this.props.onChange && this.props.onChange(event && event.target.value);
    }

    onFocus(){
        this.props.onFocus && this.props.onFocus();
    }

    onBlur(){
        this.props.onBlur && this.props.onBlur();
    }

    onClick(){
        this.props.submit && this.props.submit();
    }

    render(){
        const {className='', placeholder='', value=''} = this.props;
        return <div className={"searchText "+className}>
            <input type="search"  placeholder={placeholder} value={value} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur}/>
            <span className="glyphicon glyphicon-search" onClick={this.onClick}></span>
        </div>
    }
}