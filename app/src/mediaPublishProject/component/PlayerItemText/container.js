/** Created By ChrisWen
 *  PlayerItem --- textß
 */

import React from 'react';
import ColorPicker from '../../../components/ColorPicker';
import '../../../../public/styles/textContainer.less';

const TextContainer = (props) => {
  const { colorChange, colorValue } = props;
  const { fontColor, bgColor } = colorValue;
  return (
    <div id="player_item-container_text" className="pro-container">
      <div className="row">
        <div className="form-group">
          <label className="control-label">素材名称</label>
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
          <label className="control-label content-label">文本内容</label>
          <div className="input-container input-w-1">
            <textarea type="text" className="form-control text-content"/>
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label className="control-label">选择字体</label>
          <div className="input-container input-w-1">
            <select className="form-control" />
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label className="control-label">字体大小</label>
          <div className="input-container input-w-1">
            <select className="form-control" />
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="form-group color-picker">
          <label className="control-label">字体颜色</label>
          <div id="fontColor">
            <ColorPicker value={fontColor} onChange={color => {colorChange('fontColor', color);}}/>
          </div>
        </div>

        <div className="form-group pull-right">
          <label className="control-label color-label">背景颜色</label>
          <div id="bgColor">
            <ColorPicker value={bgColor} onChange={color => { colorChange('bgColor', color); }}/>
          </div>
        </div>
      
        <div className="form-group pull-right" id="checkbox-input">
          <label className="control-label color-label alpha-label">背景透明</label>
          <div className="input-container">
            <input type="checkbox" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="form-group">
          <label className="control-label">对齐方式</label>
          <div className="input-container input-w-1">
            <select className="form-control" />
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>
    
      <div className="row">
        <div className="form-group">
          <label className="control-label">播放时长</label>
          <div className="input-container input-w-1">
            <input type="number" placeholder="秒/s" className="form-control" />
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label className="control-label">动画效果</label>
          <div className="input-container input-w-1">
            <select className="form-control" />
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>
    
      <div className="row">
        <div className="form-group">
          <label className="control-label">动画速度</label>
          <div className="input-container input-w-1">
            <select className="form-control" />
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>
    
      <div className="row">
        <div className="form-group">
          <label className="control-label">字间距</label>
          <div className="input-container input-w-1">
            <input type="number" placeholder="pt" className="form-control" />
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>
    
      <div className="row">
        <div className="form-group">
          <label className="control-label">行间距</label>
          <div className="input-container input-w-1">
            <input type="number" placeholder="pt" className="form-control" />
            <span className="prompt hidden">
              <span>请输入正确参数</span>
            </span>
          </div>
        </div>
      </div>
      <div className="row line"/>
      <div className="row">
        <button className="btn btn-primary pull-right">确认</button>
        <button className="btn btn-gray margin-right-1 pull-right">重置</button>
      </div>
    
    </div>  
  );
};

module.exports = TextContainer;