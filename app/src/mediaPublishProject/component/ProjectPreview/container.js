import React from 'react';
import Panel from '../../../components/Panel';
import PreviewBody from './body';
import Footer from './footer';
import LoadingComponent from './loading/index';

const PreviewContainer = (props) => {
  const bodyComponent = props.imgArray.length <= 0 ? <LoadingComponent /> : <PreviewBody imgArray={props.imgArray} totalTime={props.totalTime}/>;
  return (
    <Panel title="预览"
      className="preview-containers"
      footer={<Footer onClick={props.closeClick}/>}
      closeBtn={true}
      body={bodyComponent}
      closeClick={props.closeClick} />
  );
};

export default PreviewContainer;