/**
 * Created by a on 2017/7/7.
 */
import React,{ Component } from 'react'
export default class SearchText extends Component{
    constructor(props){
        super(props)
        this.state = {
            interactive:false
        }
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onClick = this.onClick.bind(this);
        this.itemClick = this.itemClick.bind(this);
    }

    itemClick(event){
       this.setState({interactive:false})
        this.props.onChange && this.props.onChange(event && event.target.value);
    }

    onChange(event) {
        this.setState({interactive:true});
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
        const {interactive} = this.state;
        const {className='', placeholder='', value='', IsTip=false, datalist=[]} = this.props;
        return <div className={"searchText "+className}>
            <input type="search"  placeholder={placeholder} value={value} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur}/>
            <ul className={IsTip && interactive ? 'select-active':''}>
                {
                    datalist.map((item, index)=>{
                        return <li key={index} value={item.value} onClick={this.itemClick}>{item.value}</li>
                    })
                }
            </ul>
            <span className="glyphicon glyphicon-search" onClick={this.onClick}></span>
        </div>
    }
}