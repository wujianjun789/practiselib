import React from 'react';
import Panel from '../../../components/Panel';
import PreviewBody from './body';
import Footer from './footer';


const PreviewContainer = (props) => {
  return (
    <Panel title="预览"
      className="preview-containers"
      footer={<Footer onClick={props.closeClick}/>}
      closeBtn={true}
      body={<PreviewBody imgArray={props.imgArray} totalTime={props.totalTime}/>}
      closeClick={props.closeClick} />
  );
};

export default PreviewContainer;