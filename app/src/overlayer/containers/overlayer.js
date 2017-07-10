/**
 * created by Azrael on 2017/02/23
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

class Overlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overlayerPulse: false
        };
        this.handlerBodyScrollBar = this.handlerBodyScrollBar.bind(this);
    }

    overlayerClick(e) {
        if(e.target.id == 'overlayer') {
            this.setState({overlayerPulse: true});
            setTimeout(()=>{this.setState({overlayerPulse: false})}, 100);
        } else {
            return ;
        }
    }

    /**
     * 显示弹框时，隐藏body滚动条
     * @param {Boolean} show 
     */
    handlerBodyScrollBar(show) {
        if(show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    render() {
        const {overlayer} = this.props;
        const {isShowDialog, page} = overlayer;

        this.handlerBodyScrollBar(isShowDialog);
        
        return (
            <div id={'overlayer'} className={`ruantong overlayer ${isShowDialog?'overlayer-show':''}`} onClick={(e)=>this.overlayerClick(e)}>
                <div className={this.state.overlayerPulse ? 'overlayer-pulse' : ''}>
                    {page}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        overlayer: state.overlayer
    }
}

export default connect(mapStateToProps)(Overlayer);