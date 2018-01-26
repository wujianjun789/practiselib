/** Created By ChrisWen
 *  17/09/06
 *  This Component is a DeviceList.
 *  For this componet, showIcon control whether the second <div /> shows Icon or not.The first div provide two operationWords for two situation.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.test = this.test.bind(this);
  }

  onClick(item) {
    this.props.itemClick(item);
  }

  test(){
  } 

  

  componentDidMount() {

            var scale = function(dragBtn, scaleBar, showMes, deScroll) {
                this.dragBtn = document.getElementById(dragBtn);
                this.scaleBar = document.getElementById(scaleBar);
                this.showMes = document.getElementById(showMes);
                this.step = this.scaleBar.getElementsByTagName("div")[0];
                //this.scrollDiv = document.getElementById(scrollDiv);
                this.deScroll = document.getElementById(deScroll);
                this.init();
            };

            scale.prototype = {

                init: function() {

                    var f = this,
                        g = document,
                        b = window,
                        m = Math;

                    f.deScroll.addEventListener('scroll',function(e){
                        var clientHeight = e.target.clientHeight,
                        scrollHeight = e.target.scrollHeight - e.target.clientHeight;
                        f.dragBtn.style.top = e.target.scrollTop/scrollHeight*(clientHeight-50) + 'px';
                    },false);
                    f.dragBtn.onmousedown = function(e) {
                        var y = (e || b.event).clientY;
                        var l = this.offsetTop;
                        var max = f.scaleBar.offsetHeight - this.offsetHeight;
                        g.onmousemove = function(e) {
                            var thisY = (e || b.event).clientY;
                            var to = m.min(max, m.max(0, l + (thisY - y)));
                            f.dragBtn.style.top = to + 'px';
                            f.ondrag(m.round(m.max(0, to / max) * 100), to);
                            b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                        };
                        g.onmouseup = new Function('this.onmousemove=null');
                    };

                },
                ondrag: function(pos, y) {
                    
                    this.step.style.height = Math.max(0, y) + 'px';
                    this.showMes.innerHTML = pos;
                    var scrollHeight = this.deScroll.scrollHeight;
                    this.deScroll.scrollTop=pos/100*(scrollHeight-this.deScroll.clientHeight);
                    
                }
                
            }
            let dragBtn='dragBtn'+this.props.idName,scaleBar='scaleBar'+this.props.idName,showMes='showMes'+this.props.idName,deScroll=this.props.idName;
            new scale(dragBtn, scaleBar, showMes, deScroll);

  }

  

  render() {
    /**In realityEnv, sometimes we received more property than we need in this componet.We user ...otherProps to filter other useless property for this component */
    let {className='', iconClassName='', data, showIcon=false, operations=['firstOperation', 'secondOperation'], ...otherProps} = this.props;
    const showDiv = item => {
      /*item.add will control the firstDiv's status.You can use this property to control the operations(array)'s value such as index below */
      let index = item.added === true ? 1 : 0;
      return showIcon === true ? <span className="icon_delete delete"></span> : operations[index];
    }

    const deviceList = data.length === 0 ? null : data.map((item, index) => {
      return (<li className='clearfix' key={ index }>
                <div>
                  { item.name }
                </div>
                <div onClick={ () => this.onClick(item) }>
                  { showDiv(item) }
                </div>
              </li>)
    });

    return (<ul className={ className } id={ this.props.idName }>
              { deviceList }
              <div className="scale_panel">
                      <div className="scaleBar" id={ "scaleBar"+this.props.idName }>
                          <div></div>
                          <div className="dragBtn" id={ "dragBtn"+this.props.idName }>
                              <span id={ "showMes"+this.props.idName } onClick={()=>this.test()}>0</span>
                          </div>
                      </div>
                </div>
            </ul>)
  }
}

