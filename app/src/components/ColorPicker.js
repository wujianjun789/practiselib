import React, {Component} from 'react';
import { SketchPicker } from 'react-color';
import '../../public/styles/colorPicker.less';
export default class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
    };
  }

    handleColorClick = (e) => {
      e.stopPropagation();
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
      let data;
      if (typeof this.props.value == 'string' ) {
        data = color.hex;
      } else {
        data = {
          red : color.rgb.r,
          green : color.rgb.g,
          blue : color.rgb.b,
          alpha : color.rgb.a,
        };
      }
      this.props.onChange && this.props.onChange(data);    
    };
    render() {
      return <div className="color-show" role="presentation" style={{ backgroundColor: this.props.value }}
        onClick={(e) => this.handleColorClick(e)}>
        {this.state.displayColorPicker
          ? <div className="popover">
            <div className="cover" role="presentation" onClick={(e) => this.handleColorClose(e)}></div>
            <SketchPicker color={this.props.value} onChange={(color) => this.handleColorChange(color)} />
          </div>
          : null}
      </div>;
    }
}