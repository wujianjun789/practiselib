/**
 * Created by a on 2018/2/1.
 */
import React from 'React';

import PlayerScene from '../component/PlayerScene';
import PlayerAreaPro from '../component/PlayerAreaPro';

const RenderPropertyPanel = (props) => {
  const {curType, project, plan, scene, zone, actions, applyClick} = props;
  // if(!curType || !project || !parentParentNode || !parentNode || !curNode){
  //     return <div>server no data</div>;
  // }
  // area
  // case 'area'
  switch (curType) {
  case 'scene':
    return <PlayerScene projectId={project ? project.id : null} parentId={plan ? plan.id : null} data={scene}
      applyClick={data => {applyClick('playerScene', data);}}/>;
  case 'area':
    return <PlayerAreaPro projectId={project ? project.id : null} parentParentId={plan ? plan.id : null} parentId={scene  ? scene.id : null}
      data={zone} applyClick={data => {applyClick('playerAreaPro', data);}}/>;
  default:
    return <div></div>;
  }
};

export default RenderPropertyPanel;