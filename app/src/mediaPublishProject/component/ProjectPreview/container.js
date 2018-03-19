import React from 'react';
import Panel from '../../../components/Panel';
import Carousel from './Carousel/index';
import Footer from './footer';

// const PreviewContainerBody = (props) => {
//   return (<div id="preview-body">Body</div>);
// };

const PreviewContainer = (props) => {
 
  return (
    <Panel title="预览"
      className="preview-containers"
      footer={<Footer />}
      closeBtn={true}
      body={<Carousel />}
      closeClick={props.closeClick} />
  );
};

export default PreviewContainer;