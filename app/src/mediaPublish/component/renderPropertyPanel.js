/**
 * Created by a on 2018/2/1.
 */
import React from 'React';
import PlayerProject from '../component/PlayerProject';
import PlayerPlan from '../component/PlayerPlan';
import PlayerScene from '../component/PlayerScene';
import PlayerAreaPro from '../component/PlayerAreaPro';
import CyclePlan from '../component/CyclePlan';
import TimingPlan from '../component/TimingPlan';
import PlayerPicAsset from '../component/PlayerPicAsset';
import PlayerVideoAsset from '../component/PlayerVideoAsset';
import PlayerText from '../component/PlayerText';
import DigitalClock from '../component/digitalClock';
import VirtualClock from '../component/VirtualClock';
import PlayerTimeAsset from '../component/PlayerTimeAsset';

const RenderPropertyPanel = (props)=>{
    const {curType, project, parentParentNode, parentNode, curNode, playerListAsset,actions,applyClick} = props;
    // if(!curType || !project || !parentParentNode || !parentNode || !curNode){
    //     return <div>server no data</div>;
    // }
    switch(curType) {
        case 'playerProject':
            return <PlayerProject data={project} applyClick={data=>{applyClick('playerProject', data)}}/>;
        case 'playerPlan':
            return <PlayerPlan actions={actions} projectId={project?project.id:null} data={curNode}
                               applyClick={data=>{applyClick('playerPlan', data)}}/>;
        case 'playerScene':
            return <PlayerScene projectId={project?project.id:null} parentId={parentNode?parentNode.id:null} data={curNode}
                                applyClick={data=>{applyClick('playerScene', data)}}/>;
        case 'playerArea':
            return <PlayerAreaPro projectId={project?project.id:null} parentId={parentNode?parentNode.id:null} parentParentId={parentParentNode?parentParentNode.id:null}
                                  data={curNode} applyClick={data=>{applyClick('playerAreaPro', data)}}/>;
        case 'cyclePlan':
            return <CyclePlan pause={1} projectId={project?project.id:null} parentId={parentNode?parentNode.id:null}
                              parentParentId={parentParentNode?parentParentNode.id:null} data={curNode}/>;
        case 'timingPlan':
            return <TimingPlan actions={actions} projectId={project?project.id:null} parentId={parentNode?parentNode.id:null}
                               parentParentId={parentParentNode?parentParentNode.id:null} data={curNode}/>
        case 'playerPicAsset':
            return <PlayerPicAsset projectId={project?project.id:null} sceneId={parentNode?parentNode.id:null} planId={parentParentNode?parentParentNode.id:null}
                                   areaId={curNode?curNode.id:null}
                                   data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}
                                   applyClick={data=>{applyClick('playerPicAsset', data)}}/>;
        case 'playerVideoAsset':
            return <PlayerVideoAsset projectId={project?project.id:null} sceneId={parentNode?parentNode.id:null} planId={parentParentNode?parentParentNode.id:null}
                                     areaId={curNode?curNode.id:null}
                                     data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}
                                     applyClick={data=>{applyClick('playerPicAsset', data)}}/>
        case 'playerText':
            return <PlayerText projectId={project?project.id:null} sceneId={parentNode?parentNode.id:null} planId={parentParentNode?parentParentNode.id:null}
                               areaId={curNode?curNode.id:null}
                               data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}
                               applyClick={data=>{applyClick('playerText', data)}}/>
        case 'digitalClock':
            return <DigitalClock projectId={project?project.id:null} sceneId={parentNode?parentNode.id:null} planId={parentParentNode?parentParentNode.id:null}
                                 areaId={curNode?curNode.id:null}
                                 data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}
                                 applyClick={data=>{applyClick('digitalClock', data)}}/>
        case 'virtualClock':
            return <VirtualClock projectId={project?project.id:null} parentId={parentNode?parentNode.id:null} parentParentId={parentParentNode?parentParentNode.id:null}
                                 areaId={curNode?curNode.id:null}
                                 data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}/>
        case 'playerTimeAsset':
            return <PlayerTimeAsset projectId={project?project.id:null} parentId={parentNode?parentNode.id:null} parentParentId={parentParentNode?parentParentNode.id:null}
                                    areaId={curNode?curNode.id:null}
                                    data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}/>;
        default:
            return <div>no type</div>
    }
}

export default RenderPropertyPanel;