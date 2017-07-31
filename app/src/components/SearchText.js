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

    componentWillMount(){
        this.timeOut = -1;
    }

    componentWillUnmount(){
        clearTimeout(this.timeOut);
    }

    itemClick(value, index){
        this.props.itemClick && this.props.itemClick(index);
        this.props.onChange && this.props.onChange(value);
        this.setState({interactive:false})
    }

    onChange(event) {
        this.props.onChange && this.props.onChange(event && event.target.value);
        this.setState({interactive:true});
    }

    onFocus(event){
        this.props.onFocus && this.props.onFocus();
        this.setState({interactive:true});
    }

    onBlur(event){
        this.props.onBlur && this.props.onBlur();
        this.timeOut = setTimeout(()=>{this.setState({interactive:false});}, 1000)
    }

    onClick(){
        this.props.submit && this.props.submit();
    }

    render(){
        const {interactive} = this.state;
        const {className='', placeholder='', value='', IsTip=false, datalist=[]} = this.props;
        return <div className={"searchText "+className} onFocus={this.onFocus} onBlur={this.onBlur}>
            <input type="search"  placeholder={placeholder} value={value} onChange={this.onChange}/>
            <ul className={IsTip && interactive ? 'select-active':''}>
                {
                    datalist.map((item, index)=>{
                        return <li key={index} value={item.value} onClick={()=>this.itemClick(item.value, index)}>{item.value}</li>
                    })
                }
            </ul>
            <span className="glyphicon glyphicon-search" onClick={this.onClick}></span>
        </div>
    }
}