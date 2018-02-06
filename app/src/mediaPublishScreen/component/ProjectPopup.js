/**
 * Created by a on 2018/2/6.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Panel from './../../components/Panel';
import PanelFooter from './../../components/PanelFooter';

import NotifyPopup from '../../common/containers/NotifyPopup'
import {FormattedMessage,injectIntl} from 'react-intl';

import {getProjectList} from '../../api/mediaPublish';
import lodash from 'lodash';
export default class ProjectPopup extends PureComponent {
    constructor(props) {
        super(props);
        const {applyProjectList} = this.props.data;
        this.state = {
            applyProjectList: applyProjectList
        }

        this.projectList = [];

        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.addProject = this.addProject.bind(this);
        this.removeProject = this.removeProject.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getProjectList(data=>{
            if(this.mounted){
                this.projectList = data;
                this.setState(this.projectList);
            }
        })
    }

    componentWillUnmout(){
        this.mounted = false;
    }

    onConfirm() {
        this.props.onConfirm(this.state);
    }

    onCancel() {
        this.props.onCancel();
    }

    removeProject(){

    }

    addProject(){

    }

    render() {
        const {title} = this.props;
        let {applyProjectList} = this.state;

        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['button.cancel','button.confirm']}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
console.log('projectList:',this.projectList, applyProjectList);

        return <Panel className="project-popup" title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
            <div className = 'form-group row project-container'>
                <label className="control-label"><FormattedMessage id="permission.domain"/>:</label>
                <div className="project-content">
                    <div className='project-list'>
                        <ul>
                            {
                                this.projectList.map((item)=>{
                                    const index = lodash.findIndex(applyProjectList, project=>{return project.id == item.id});
                                    console.log(index);
                                    return <li key = {item.id}>
                                        <span className="name">{item?item.name:""}</span>
                                        <span className="icon-add-container">
                                            {
                                                index > -1 ? <FormattedMessage id='permission.added'/>:<span className='glyphicon glyphicon-plus' onClick={()=>this.addProject(item.key)}></span>
                                            }
                                        </span>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    <div className='apply-project-list'>
                        <ul>
                            {
                                applyProjectList.map((item)=>{
                                    const project = lodash.find(this.projectList, project=>{return project.id == item.id});
                                    console.log(project);
                                    return <li key = {item.id}>
                                        <span className="name">{project?project.name:""}</span>
                                        <span className="icon-table-delete" onClick={()=>this.removeProject(item)}></span>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </Panel>
    }
}

ProjectPopup.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        applyProjectList: PropTypes.array.isRequired,
    }).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}