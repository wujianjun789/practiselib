/**
 * Created by a on 2018/2/1.
 */
import React from 'React';

import PlayerScene from '../component/PlayerScene';
import PlayerAreaPro from '../component/PlayerAreaPro';
// import PlayerItemText from '../component/PlayerItemText/component';
import PlayerPicAsset from '../component/PlayerPicAsset';
import PlayerVideoAsset from '../component/PlayerVideoAsset';
import PlayerText from '../component/PlayerText';
import TextFile from '../component/TextFile';

const RenderPropertyPanel = (props) => {
  const {curType, project, plan, scene, zone, item, actions, applyClick} = props;
  // if(!curType || !project || !parentParentNode || !parentNode || !curNode){
  //     return <div>server no data</div>;
  // }
  // area
  // case 'area'
  // console.log('curType:',curType);
  switch (curType) {
  case 'scene':
    return <PlayerScene projectId={project ? project.id : null} parentId={plan ? plan.id : null} data={scene}
                        actions={actions} applyClick={data => {applyClick('playerScene', data);}}/>;
  case 'area':
    return <PlayerAreaPro projectId={project ? project.id : null} parentParentId={plan ? plan.id : null} parentId={scene  ? scene.id : null}
      data={zone} actions={actions} applyClick={data => { applyClick('playerAreaPro', data); }} />;
  case "playerPicAsset":
    return <PlayerPicAsset projectId={project?project.id:null} planId={plan?plan.id:null} sceneId={scene?scene.id:null}
                           areaId={zone?zone.id:null} data={{id:item?item.id:undefined,name:item?item.name:""}} actions={actions} applyClick={data=>{applyClick('playerPicAsset', data)}}/>
  case "playerVideoAsset":
    return <PlayerVideoAsset projectId={project?project.id:null} planId={plan?plan.id:null} sceneId={scene?scene.id:null}
                             areaId={zone?zone.id:null} data={{id:item?item.id:undefined,name:item?item.name:""}} actions={actions} applyClick={data=>{applyClick('playerPicAsset', data)}}/>
    case "playerText":
      return <PlayerText projectId={project?project.id:null} planId={plan?plan.id:null} sceneId={scene?scene.id:null}
                         areaId={zone?zone.id:null} data={{id:item?item.id:undefined,name:item?item.name:""}} actions={actions} applyClick={data=>{applyClick('playerText', data)}}/>
    case "textFile":
      return <TextFile projectId={project?project.id:null} planId={plan?plan.id:null} sceneId={scene?scene.id:null}
                       areaId={zone?zone.id:null} data={{id:item?item.id:undefined,name:item?item.name:""}} actions={actions} applyClick={data=>{applyClick('textFile', data)}}/>
  default:
    return <div></div>;
  }
};

export default RenderPropertyPanel;