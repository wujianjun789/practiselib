import React from 'react';
import PanelFooter from '../../../components/PanelFooter';

const PlayerAreaComponent = (props) => {
  /** props
   * onChange - Input form onChange event.
   * onCancel - footer Button onCancel event.
   * onConfirm - footer Button onConfirm event.
   * optionList - select form optionList.
   * areaProperty - {name,width,height,x,y,lastFrames} - PlayerArea property.
   */
  const { areaProperty, onChange, onCancel, onConfirm, optionList } = props;
  const { name: name, width: width, height: height, x: x, y: y } = areaProperty;
  const footer = <PanelFooter
    funcNames={['onCancel', 'onConfirm']}
    btnTitles={['button.cancel', 'button.confirm']}
    btnClassName={['btn-default', 'btn-primary']}
    // btnDisabled={[false, valid]}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />;

  // item.name,item.value
  const optionList = optionList.map((item, index) => {
    return <option key={index} value={item.value}>{item.name}</option>;
  });

  
  
  return (
    <div id="player-area" className="pro-container">
      <div className="row">
        <div className="form-group">
          <label className="control-label">名称</label>
          <div className="input-container input-w-1">
            <input type="text" className="form-control" value={name} onChange={onChange}/>
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label className="control-label">宽度</label>
          <div className="input-container input-w-1">
            <input type="text" className="form-control" value={width} onChange={onChange}/>
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label className="control-label">高度</label>
          <div className="input-container input-w-1">
            <input type="text" className="form-control" value={height} onChange={onChange}/>
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label className="control-label">X</label>
          <div className="input-container input-w-1">
            <input type="text" className="form-control" value={x} onChange={onChange}/>
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>
    
      <div className="row">
        <div className="form-group">
          <label className="control-label">Y</label>
          <div className="input-container input-w-1">
            <input type="text" className="form-control" value={y} onChange={onChange}/>
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label className="control-label">结束</label>
          <div className="input-container input-w-1">
            <select className="form-control" onChange={onChange}>
              {optionList}
            </select>
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>
      {footer}
    </div>
  );
};

export default PlayerAreaComponent;