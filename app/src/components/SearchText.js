/**
 * Created by a on 2017/7/7.
 */
import React,{ Component } from 'react'

import {keyboard_key_up, keyboard_key_down, keyboard_key_enter} from '../util/keyboard'
export default class SearchText extends Component{
    constructor(props){
        super(props)
        this.state = {
            interactive:false,
            tableIndex: -1
        }
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onClick = this.onClick.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.onkeydown = this.onkeydown.bind(this);
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

    onkeydown(event){
        let tableIndex = this.state.tableIndex;
        const {datalist} = this.props;
        switch(event.key){
            case keyboard_key_up:
                if(tableIndex>0){
                    tableIndex--;
                }
                break;
            case keyboard_key_down:
                if(tableIndex<datalist.length-1){
                    tableIndex++;
                }
                break;
            case keyboard_key_enter:
                if(tableIndex>-1&&tableIndex<datalist.length){
                    let value = datalist[tableIndex].value;
                    this.props.onChange && this.props.onChange(value);
                    this.setState({interactive:false});
                }

                tableIndex = -1;
                break;
        }

        this.setState({tableIndex:tableIndex});
    }

    render(){
        const {interactive, tableIndex} = this.state;
        const {className='', placeholder='', value='', IsTip=false, datalist=[]} = this.props;
        return <div className={"searchText "+className} onFocus={this.onFocus} onBlur={this.onBlur} onKeyDown={(event)=>{IsTip && datalist && this.onkeydown(event)}}>
            <input type="search"  placeholder={placeholder} value={value} onChange={this.onChange}/>
            <ul className={IsTip && interactive ? 'select-active':''} >
                {
                    datalist.map((item, index)=>{
                        return <li className={index==tableIndex?"active":""} key={index} value={item.value} onClick={()=>this.itemClick(item.value, index)}>{item.value}</li>
                    })
                }
            </ul>
            <span className="glyphicon glyphicon-search" onClick={this.onClick}></span>
        </div>
    }
}