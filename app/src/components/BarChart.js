import React, { PureComponent, Component } from 'react';

// import { intlFormat } from '../util/index';
export default class BarChart extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
           isFirst:true 
        }
        this.draw = this.draw.bind(this);
    }

    ComponentDidMount(){
        console.log("here")
        
        let {data} = this.props;
        if(!data){
            return;
        }
        this.draw(this.state.isFirst);
    }

    componentDidUpdate(){
        let {data}=this.props;
        if(!data){
            return;
        }
        this.draw(this.state.isFirst);
    }

    draw(isFirst){
        isFirst && this.setState({isFirst:false});
        let {width=700, height=200, data, className='', range} = this.props;
        if(!data){
            return;
        }
        let svg = d3.select(`.${className}BarChart`)
            .attr('width',width)
            .attr('height',height)
            .attr("viewBox",'0 0 400 400')
    }

    render() {
        const {data, className} = this.props;
        return (
            <svg className={`${className}BarChart`}>
            
            </svg>
        )
    }
}