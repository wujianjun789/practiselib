import React from 'react';
import PanelFooter from './../../components/PanelFooter';

const PlayerArea = (props) => {
  const footer = <PanelFooter funcNames={['onCancel', 'onConfirm']} btnTitles={['button.cancel', 'button.confirm']}
    btnClassName={['btn-default', 'btn-primary']}
    // btnDisabled={[false, valid]}
    // onCancel={this.onCancel} onConfirm={this.onConfirm}
  />;
  
  return (
    <div id="player-area" className="pro-container">
      <div className="row">
        <div className="form-group">
          <label className="control-label">名称</label>
          <div className="input-container input-w-1">
            <input type="text" className="form-control" />
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
            <input type="text" className="form-control" />
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
            <input type="text" className="form-control" />
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
            <input type="text" className="form-control" />
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
            <input type="text" className="form-control" />
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
            <select className="form-control" >
              <option>测试一</option>
              <option>测试一</option>
              <option>测试一</option>
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

export default PlayerArea;