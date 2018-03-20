import React from 'react';
import '../../../../../public/styles/bubble.less';

const Bubble = (props) => {
  const { content = 'Hello World', style = {}, active } = props;
  return (
    <div id="bubble-container"style={style} >
      <div id={`bubble ${active}`}>
        <span class="bot"></span>
      </div>
    </div>  
  );
};
export default Bubble;