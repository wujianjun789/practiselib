/**
 * Created by a on 2017/7/7.
 */
import React,{Component} from 'react'

export default class Select extends Component{
    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this);
    }

    onChange(event){
        this.props.onChange && this.prop.onChange(event.target.selectedIndex);
    }

    render(){
        const {className='', data={list:[],value:''}} = this.props;
        return <select className={"select "+className} value={data.value} onChange={this.onChange}>
            {
                 data.list.map((option, index)=>{
                    return <option key={index} value={option.value}>{option.value}</option>
                })
            }

        </select>
    }
}