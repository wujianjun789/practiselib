import React,{Component}from 'react';
import { SketchPicker } from 'react-color';
import "../../public/styles/colorPicker.less"
export default class ColorPicker extends Component{
    constructor(props){
        super(props)
        this.state={
            displayColorPicker: false,
        }
    }

    handleColorClick = (e) => {
        e.stopPropagation();
        debugger
        if (this.parentTarget === undefined) {
            this.parentTarget = e.target;
            this.setState({ displayColorPicker: !this.state.displayColorPicker });
            return;
        } else {
            if (this.parentTarget !== e.target) {
                return;
            }
        }
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleColorClose = (e) => {
        e.stopPropagation();
        this.setState({ displayColorPicker: false });
    };

    handleColorChange = (color) => {
        this.props.onChange && this.props.onChange(color.hex);        
    };
    render() {
        return <div className='color-show' style={{ backgroundColor: this.props.value }} onClick={(e) => this.handleColorClick(e)}>
            {this.state.displayColorPicker
                ? <div className='popover'>
                    <div className='cover' onClick={(e) => this.handleColorClose(e)}></div>
                    <SketchPicker color={this.props.value} onChange={(color) => this.handleColorChange(color)} />
                </div>
                : null}
        </div>
    }
}