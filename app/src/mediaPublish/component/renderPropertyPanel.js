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
    const {curType, project, parentParentNode, parentNode, curNode, playerListAsset} = props;
    switch(curType) {
        case 'playerProject':
            return <PlayerProject data={project} applyClick={data=>{this.applyClick('playerProject', data)}}/>;
        case 'playerPlan':
            return <PlayerPlan projectId={project.id} data={curNode}
                               applyClick={data=>{this.applyClick('playerPlan', data)}}/>;
        case 'playerScene':
            return <PlayerScene projectId={project.id} parentId={parentNode.id} data={curNode}
                                applyClick={data=>{this.applyClick('playerScene', data)}}/>;
        case 'playerArea':
            return <PlayerAreaPro projectId={project.id} parentId={parentNode.id} parentParentId={parentParentNode.id}
                                  data={curNode} applyClick={data=>{this.applyClick('playerAreaPro', data)}}/>;
        case 'cyclePlan':
            return <CyclePlan pause={1} projectId={project.id} parentId={parentNode.id}
                              parentParentId={parentParentNode.id} data={curNode}/>;
        case 'timingPlan':
            return <TimingPlan actions={this.props.actions} projectId={project.id} parentId={parentNode.id}
                               parentParentId={parentParentNode.id} data={curNode}/>
        case 'playerPicAsset':
            return <PlayerPicAsset projectId={project.id} sceneId={parentNode.id} planId={parentParentNode.id}
                                   areaId={curNode.id}
                                   data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}
                                   applyClick={data=>{this.applyClick('playerPicAsset', data)}}/>;
        case 'playerVideoAsset':
            return <PlayerVideoAsset projectId={project.id} sceneId={parentNode.id} planId={parentParentNode.id}
                                     areaId={curNode.id}
                                     data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}
                                     applyClick={data=>{this.applyClick('playerPicAsset', data)}}/>
        case 'playerText':
            return <PlayerText projectId={project.id} sceneId={parentNode.id} planId={parentParentNode.id}
                               areaId={curNode.id}
                               data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}
                               applyClick={data=>{this.applyClick('playerText', data)}}/>
        case 'digitalClock':
            return <DigitalClock projectId={project.id} sceneId={parentNode.id} planId={parentParentNode.id}
                                 areaId={curNode.id}
                                 data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}
                                 applyClick={data=>{this.applyClick('digitalClock', data)}}/>
        case 'virtualClock':
            return <VirtualClock projectId={project.id} parentId={parentNode.id} parentParentId={parentParentNode.id}
                                 areaId={curNode.id}
                                 data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}/>
        case 'playerTimeAsset':
            return <PlayerTimeAsset projectId={project.id} parentId={parentNode.id} parentParentId={parentParentNode.id}
                                    areaId={curNode.id}
                                    data={{id:playerListAsset.get("id"),name:playerListAsset.get('name')}}/>;
    }
}

export default RenderPropertyPanel;