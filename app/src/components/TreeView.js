/**
 * Created by a on 2017/7/3.
 */
import React, { Component } from 'react'
import {Link} from 'react-router';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {onToggle} from '../common/actions/treeView'

import {getLanguage} from '../util/index'
export class TreeView extends Component{
    constructor(props){
        super(props)
        this.state = {
            language: getLanguage()
        },
        this.renderTree = this.renderTree.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node){
        const {actions} = this.props
        actions && actions.onToggle(node)
        this.props.onToggle && this.props.onToggle(node);
    }

    renderTree(datalist, index, toggled){
        if(!datalist){
            return null;
        }
        let curIndex = index;
        let nextIndex = index + 1;
        let style = {"height":index>1 ? (toggled ? datalist.length*40+'px':'0'):'auto'};
        return <ul className={"tree-"+curIndex} style={style}>
            {
                datalist.map((node, index)=> {
                    let count = this.state.language=='zh'?6:10;
                    let value = node.name.slice(0, count)+(node.name.length>count?'...':'');
                    if(curIndex > 1){
                        return <li key={index} className={'node '+(node.active ? 'active':'')}>
                                    <Link to={node.link}>
                                    <div onClick={()=>this.onToggle(node)} title={node.name}><svg><use xlinkHref={"#"+(node.class)} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>
                                        <span>{value}</span></div></Link>
                                    {node.children && this.renderTree(node.children, nextIndex, node.toggled)}
                                </li>
                    }else{
                        return <li key={index} className={'node '+(node.active ? 'active':'')}>
                                    <Link to={node.link}>
                                    <div onClick={()=>this.onToggle(node)} title={node.name}><span className={'glyphicon '+(node.toggled ? 'glyphicon-triangle-bottom':'glyphicon-triangle-right')}></span>
                                        {value}</div></Link>
                                    {node.children && this.renderTree(node.children, nextIndex, node.toggled)}
                                </li>
                    }
                })
            }
        </ul>
    }

    render(){
        const {datalist} = this.props;
        return <div className="tree-list">
            <svg className="svgOnload" > 
                <symbol id="icon_led_light"><path d="M172.383,28.273l0.127-0.127c-31.503-31.489-82.564-31.489-114.067,0C39.709,46.881,35.631,96.968,35.631,96.968
    c-0.453,5.412-2.249,10.625-5.225,15.166c-13.881,12.784-21.039,31.29-19.372,50.087c0.279,3.028-2.931,6.118-2.931,6.118
    c-6.245,6.245-2.549,12.745,3.696,18.735l1.912,1.912c6.245,6.245,12.745,10.068,18.862,3.823c0,0,2.303-3.247,6.118-2.931
    c18.75,1.502,37.143-5.742,49.833-19.627c4.517-2.912,9.683-4.663,15.039-5.098c0,0,50.087-3.951,68.822-22.813
    C203.872,110.837,203.872,59.776,172.383,28.273z M27.092,162.987c-4.592,2.847-12.258-5.653-7.137-10.196
    c6.882-4.716,22.941-16.951,21.921-30.588c-0.075-13.954,1.988-27.837,6.118-41.166c1.674-6.204,12.674-2.037,10.961,3.696
    c-4.277,13.695-6.426,27.966-6.372,42.313C53.856,144.252,33.591,158.908,27.092,162.987z M119.365,152.663
    c-11.946,3.461-24.275,5.43-36.705,5.863h-4.206c-14.274,0-26.255,15.421-30.588,21.921c-1.003,1.632-2.801,2.604-4.716,2.549
    c-1.427,0.02-9.983-4.829-5.863-9.431c3.823-5.863,17.715-25.49,34.411-25.49h5.608c12.969-0.535,27.151-3.008,38.235-6.5
    C120.917,139.708,126.833,150,119.365,152.663z M166.138,133.164c-4.843,4.843-14.784,12.108-18.862,11.47l-0.255,0
    c-32.882-4.843-85.901-59.519-91.126-92.401c-0.573-3.669,5.352-11.052,10.074-15.93c0.28-0.29,5.251,16.052,5.521,15.781
    c0.017-0.017-1.782,3.458,1.015,6.157c0.828,0.676,5.87-2.408,7.601-3.732c1.504-0.846,38.477-22.176,77.166,6.903
    c2.311,2.171,5.561,0.588,3.522-6.079c-4.911-5.57-22.794-16.667-42.044-17.831c-28.333-1.419-46.512,13.657-46.532,13.591
    c-0.029-0.097-1.003-0.141-1.037-0.252c-1.15-3.758-5.038-14.74-4.848-14.925c28.22-26.193,73.49-25.693,99.682,2.527
    C190.792,65.138,190.846,106.405,166.138,133.164z
"/></symbol> 
    <symbol id="icon_light_control"><path d="M191.47,25.705c0-9.254-7.533-16.787-16.787-16.787H25.217c-9.254,0-16.787,7.533-16.787,16.787v36.587
    c0,3.658,1.183,7.103,3.336,10.008C9.615,75.205,8.43,78.649,8.43,82.308v36.587c0,3.658,1.183,7.103,3.336,10.008
    c-2.152,2.905-3.336,6.349-3.336,10.008v36.587c0,9.254,7.533,16.787,16.787,16.787h149.467c9.254,0,16.787-7.533,16.787-16.787
    V138.91c0-3.658-1.183-7.103-3.336-10.008c2.152-2.905,3.336-6.349,3.336-9.899V82.415c0-3.658-1.183-7.103-3.336-10.008
    c2.152-2.905,3.336-6.349,3.336-9.899V25.705H191.47z M179.778,61.705c-0.22,1.543-1.543,2.754-3.196,2.754H23.428
    c-1.763,0-3.196-1.432-3.196-3.196V43.032c0,0,15.911-0.084,18.651-0.084c0,7.282,12.078,7.693,12.078-0.139
    c0.334-0.005,8.801-0.019,11.868-0.038c0.336,7.277,11.338,7.643,11.779-0.13c6.188-0.034,30.515-0.106,30.515-0.106
    s-0.05,5.417,6.112,5.417c10.226,0,33.964,0,44.28,0c6.528,0,6.487-5.178,6.487-6.074c0-0.895-0.781-5.176-7.309-5.176
    c-10.591,0-32.138,0.082-42.637,0.082c-7.121,0-6.95,5.675-6.95,5.675s-24.231,0.1-30.471,0.086c0-7.536-11.743-8.063-11.795,0.137
    c-3.141-0.007-11.524,0.017-11.817,0.017c0-7.956-12.149-8.152-12.149,0.154c-1.619,0-18.728,0.12-18.728,0.12l0.086-19.17
    c0-1.763,1.432-3.196,3.196-3.196h153.045c1.763,0,3.196,1.432,3.196,3.196v37.463L179.778,61.705L179.778,61.705z M20.232,81.759
    c0-1.763,1.432-3.196,3.196-3.196h153.045c1.763,0,3.196,1.432,3.196,3.196v37.793c-0.22,1.543-1.543,2.754-3.196,2.754H23.428
    c-1.763,0-3.196-1.432-3.196-3.196v-18.509c0,0,16.626-0.076,17.871-0.076c0,9.324,14.106,9.141,14.106,0.199
    c0.267,0,8.197-0.053,9.857-0.053c1.327,10.593,14.041,7.698,13.744,0.06c5.546-0.039,27.481,0.525,27.481,0.525
    s0.549,5.99,7.806,5.99c7.257,0,36.84-0.144,42.592-0.144c7.395,0,7.142-6.299,7.142-6.299s-0.02-6.848-7.416-6.848
    c-5.615,0-35.929,0-42.752,0c-6.823,0-7.33,7.103-7.33,7.103s-21.965-0.609-27.523-0.588c0-10.453-13.578-9.087-13.578-0.135
    c-4.821,0.016-9.753,0.027-10.024,0.027c0-10.372-14.106-9.916-14.106,0.083c-1.744,0-17.871,0.054-17.871,0.054L20.232,81.759z
     M20.232,139.495c0-1.763,1.432-3.196,3.196-3.196h153.045c1.763,0,3.196,1.432,3.196,3.196v37.903
    c-0.22,1.543-1.543,2.754-3.196,2.754H23.428c-1.763,0-3.196-1.432-3.196-3.196v-18.531c0,0,14.554-0.53,16.361-0.53
    c0,8.514,13.483,11.111,15.257,0.268c0.187,0,8.327-0.12,9.946-0.12c0,8.251,13.421,12.223,15.338-0.445
    c5.605-0.024,26.902,0.449,26.902,0.449s0.898,7.256,7.289,7.256s39.624,0.01,46.015,0.01c6.391,0,6.938-7.305,6.938-7.305
    s-0.912-7.133-6.938-7.133c-6.026,0-40.355,0-46.38,0c-6.026,0-6.673,6.927-6.673,6.927s-21.512-0.526-27.215-0.526
    c-1.787-10.703-15.14-8.718-15.264,0.685c-5.016,0-9.706,0.116-9.976,0.116c0-11.937-15.239-10.111-15.239-0.274
    c-1.246,0-16.361,0.526-16.361,0.526L20.232,139.495L20.232,139.495z"/></symbol>
<symbol id="icon_time_strategy"><path d="M170.802,21.007h-32.976v-6.124c0-2.627-1.778-4.386-4.425-4.386s-4.425,1.758-4.425,4.386v6.124H71.024
    v-6.124c0-2.627-1.778-4.386-4.425-4.386c-2.647,0-4.425,1.758-4.425,4.386v6.124H29.198c-9.739,0-17.701,7.882-17.701,17.523
    v131.43c0,9.64,7.961,17.523,17.701,17.523h141.604c9.739,0,17.701-7.882,17.701-17.523V38.53
    C188.503,28.889,180.541,21.007,170.802,21.007z M33.476,34.278H62.58v18.933c0,2.469,1.671,4.121,4.158,4.121
    s4.158-1.652,4.158-4.121V34.278h58.209v18.933c0,2.469,1.671,4.121,4.158,4.121c2.487,0,4.158-1.652,4.158-4.121V34.278h29.104
    c4.993,0,8.316,3.285,8.316,8.241V70.51H25.16V42.501C25.16,37.564,29.318,34.278,33.476,34.278z M166.524,174.232H33.476
    c-4.993,0-8.316-3.285-8.316-8.241v-27.541l96.184,0l-2.89-7.56l-60.696,0.289l-32.598,6.381v-23.346l120.641-0.445l-3.78-7.56
    l-84.934-0.273l-31.905,7.388L25.16,78.733H174.84v87.276C174.84,170.129,171.517,174.232,166.524,174.232L166.524,174.232z
"/></symbol>
<symbol id="icon_sensor_strategy"><path d="M100,2.424C46.109,2.424,2.424,46.119,2.424,100c0,53.891,43.685,97.576,97.576,97.576
    c53.896,0,97.576-43.685,97.576-97.576C197.576,46.119,153.896,2.424,100,2.424z M100,183.697
    c-46.149,0-83.697-37.548-83.697-83.697S53.851,16.308,100,16.308S183.697,53.851,183.697,100S146.149,183.697,100,183.697z
     M136.439,54.721c-0.69,0-1.359,0.11-1.989,0.296L86.268,69.899c-10.933,3.334-20.373,11.89-23.71,22.822
    c0,0-7.6,19.388,9.679,36.667c14.466,12.055,33.045,6.051,33.045,6.051c10.934-3.331,19.494-11.885,22.833-22.817l14.871-49.058
    c1.102-3.619-0.939-7.446-4.558-8.547C137.784,54.821,137.113,54.721,136.439,54.721z M95.342,116.365
    c-7.566,0-13.699-6.133-13.699-13.699c0-7.566,7.015-13.699,14.581-13.699s12.817,6.133,12.817,13.699
    C109.041,110.232,102.908,116.365,95.342,116.365z
"/></symbol>
<symbol id="icon_plc_control"><path d="M162.972,50.217V13.583l-3.805-3.945h-5.834l-3.875,3.779v36.8c-10.472,2.954-24.374,12.563-24.374,30.448
    c0,7.934,2.802,14.25,6.76,19.054l-10.865,7.557c-5.161-5.467-12.043-8.59-17.674-10.178V13.743l-4.18-4.105H94.25l-4.459,4.855
    v82.606c-10.414,2.938-24.22,12.847-24.373,30.542l-17.167,0.609l-0.196-44.916C58.528,80.379,73.333,71.281,73.333,52.5
    s-14.805-27.046-25.278-30v-8.75l-3.805-3.625h-5.375l-4.334,4V22.5c-10.472,2.954-24.374,12.563-24.374,30.448
    s13.902,27.431,24.374,30.385l0.452,103.348l4.709,4.798h4.25l4.555-4.798l-0.253-58.354l17.163-0.611
    c0.088,17.776,13.935,27.271,24.374,30.215v29.318l4.459,4.23h5.001l4.055-4.23v-29.318c10.473-2.954,25.278-12.052,25.278-30.833
    c0-8.627-3.124-15.035-7.516-19.728l10.802-7.564c4.958,5.961,11.798,9.61,17.589,11.244v76.201l4.292,4.348h5l4.222-4.473V111.05
    c10.473-2.954,25.278-12.052,25.278-30.833C188.25,61.435,173.445,53.171,162.972,50.217z M41.833,71
    c-9.861,0-17.882-8.022-17.882-17.882c0-9.86,8.022-17.882,17.882-17.882c9.86,0,17.882,8.022,17.882,17.882
    C59.716,62.979,51.694,71,41.833,71z M97.083,145.599c-9.861,0-17.882-8.022-17.882-17.882s8.022-17.882,17.882-17.882
    c9.86,0,17.882,8.022,17.882,17.882C114.966,137.578,106.944,145.599,97.083,145.599z M156.75,98.717
    c-9.861,0-17.882-8.022-17.882-17.882s8.022-17.882,17.882-17.882s17.882,8.022,17.882,17.882
    C174.633,90.696,166.611,98.717,156.75,98.717z
"/></symbol>
<symbol id="icon_latlng_strategy"><path d="M177.855,12H36.072l-6.079,11.509l146.864-0.162l0.973,154.969l-153.996,0.162l-0.016-23.992L153.396,154l-0.008-11.793
    l-107.104-0.503v12.296H23.809l-0.007-23.18l129.23-0.567l-0.008-12.401l-106.984-0.336l0.001,12.716H23.794L23.77,89.084h37.093
    c0.481,0.038,0.953,0.085,1.452,0.104c1.009,0,1.971-0.04,2.906-0.104h71.413c1.422,0.204,2.934,0.31,4.561,0.291
    c1.349-0.032,2.611-0.131,3.793-0.291h32.129v-0.491h-29.564c6.33-1.554,9.653-5.409,9.943-11.584
    c-0.126-4.745-2.375-8.244-6.746-10.492c-2.874-1.499-6.122-2.623-9.742-3.373c-5.123-1.124-7.56-2.872-7.308-5.246
    c0.249-2.497,2.185-3.809,5.808-3.935c4.497,0,7.056,2.061,7.682,6.183l9.181-1.874c-1.751-7.869-7.494-11.739-17.237-11.616
    c-9.368,0.501-14.427,4.248-15.176,11.241c-0.253,6.247,3.434,10.182,11.054,11.804c2.497,0.626,5.247,1.437,8.244,2.436
    c2.871,1.124,4.309,2.875,4.309,5.246c-0.252,3.124-2.436,4.749-6.557,4.872c-5.498,0-8.62-2.81-9.369-8.431l-9.181,1.686
    c1.41,7.05,5.297,11.409,11.659,13.083H95.665V74.011h6.934c11.115,0,16.61-4.558,16.487-13.678
    c-0.374-8.493-5.558-12.864-15.55-13.115H86.297v41.375H69.13c5.933-1.144,9.971-3.941,12.108-8.399V64.83H60.441v7.494H72.62v5.059
    c-1.874,2.875-5.185,4.31-9.93,4.31c-6.997-0.624-10.618-5.182-10.867-13.678c0.498-8.244,3.87-12.677,10.117-13.303
    c4.872,0,8.306,1.874,10.305,5.621l8.619-3.185c-3.25-6.994-9.62-10.492-19.111-10.492c-12.492,0.749-19.111,7.807-19.861,21.172
    c0.429,11.851,5.564,18.763,15.378,20.765h-33.5l-0.038-65.225l5.665,0.092L35.342,12H23.671C17.225,12,12,17.225,12,23.671v154.184
    c0,6.446,5.225,11.671,11.671,11.671h154.184c6.446,0,11.671-5.225,11.671-11.671V23.671C189.527,17.225,184.301,12,177.855,12z
     M95.665,54.525h6.183c4.871,0.126,7.369,2.187,7.494,6.183c-0.125,3.999-2.623,6.06-7.494,6.183h-6.183V54.525z
"/></symbol>
<symbol id="icon_domain_list"><path d="M176.455,134.028h-8.722V102.77c0-6.423-5.207-11.629-11.629-11.629l0,0h-50.24V66.881h8.722
    c6.423,0,11.629-5.207,11.629-11.629v0V26.178c0-6.423-5.207-11.629-11.629-11.629c0,0,0,0,0,0H85.512
    c-6.423,0-11.629,5.207-11.629,11.629v29.074c0,6.423,5.207,11.629,11.629,11.629h8.722V91.14h-50.24
    c-6.423,0-11.629,5.207-11.629,11.629l0,0v31.259h-8.722c-6.423,0-11.629,5.207-11.629,11.629c0,0,0,0,0,0v29.074
    c0,6.423,5.207,11.629,11.629,11.629c0,0,0,0,0,0h29.074c6.423,0,11.629-5.207,11.629-11.629l0,0v-29.074
    c0-6.423-5.207-11.629-11.629-11.629c0,0,0,0,0,0h-8.722V104.77h50.24v29.259h-8.722c-6.423,0-11.629,5.207-11.629,11.629l0,0
    v29.074c0,6.423,5.207,11.629,11.629,11.629c0,0,0,0,0,0h29.074c6.423,0,11.629-5.207,11.629-11.629v0v-29.074
    c0-6.423-5.207-11.629-11.629-11.629h0h-8.722V104.77h50.24v29.259h-8.722c-6.423,0-11.629,5.207-11.629,11.629v0v29.074
    c0,6.423,5.207,11.629,11.629,11.629h0h29.074c6.423,0,11.629-5.207,11.629-11.629v-29.074
    C188.084,139.235,182.878,134.028,176.455,134.028z M85.512,53.252V24.178h29.074v29.074L85.512,53.252z M52.716,172.732H23.642
    v-29.074h29.074V172.732z M114.585,143.658v29.074H85.512v-29.074H114.585z M176.455,172.732h-29.074v-29.074h29.074V172.732z
"/></symbol>
<symbol id="icon_domain_topology"><path d="M163.751,14.572H36.249c-10.741,0-19.479,8.741-19.479,19.48v146.349c0,2.933,2.378,5.313,5.312,5.313
    c0.298,0,0.588-0.031,0.871-0.077c0.298,0.051,0.6,0.077,0.903,0.077c1.15,0,2.309-0.374,3.284-1.138l21.873-17.228l21.873,17.228
    c1.928,1.515,4.644,1.515,6.575,0l22.696-17.875l21.998,17.325c1.93,1.515,4.645,1.515,6.575,0l21.855-17.214l22.274,17.542
    c1.043,0.821,2.294,1.186,3.52,1.131c0.487,0.147,1.003,0.228,1.538,0.228c2.935,0,5.313-2.379,5.313-5.313V34.052
    C183.231,23.312,174.493,14.572,163.751,14.572z M168.473,166.573l-17.666-13.912c-1.82-1.429-4.381-1.429-6.201,0l-20.612,16.234
    l-20.745-16.339c-1.82-1.429-4.381-1.429-6.201,0l-21.404,16.857l-20.628-16.247c-1.82-1.429-4.381-1.429-6.201,0l-17.288,13.615
    l0-41.99l116.904-0.276v-14.74l-99.296-0.163l0,14.903H31.5l0.028-31.266l116.904-0.247v-14.74l-99.296-0.223l0,14.962H31.528
    V60.833l95.475-0.32v-14.74l-73.337-0.274l0,15.126H31.528V37.773c0-4.606,3.746-8.35,8.35-8.35h120.244
    c4.604,0,8.35,3.745,8.35,8.35L168.473,166.573L168.473,166.573z
"/></symbol>
<symbol id="icon_screen"><path d="M160.5,4.5H40.167c-6.627,0-12,5.373-12,12v167c0,6.627,5.373,12,12,12H160.5c6.627,0,12-5.373,12-12v-167
    C172.5,9.873,167.127,4.5,160.5,4.5z M160.5,170.5c0,6.627-5.373,12-12,12H52.167c-6.627,0-12-5.373-12-12V30.167
    c0-6.627,5.373-12,12-12h96.166c0,0-15.459,26.437-16.99,28.396c2.216-2.885-0.969-11.688-9.191-5.562
    c-3.627,3.627-27.635,33.95-41.986,49.333C73,98.5,82.375,104.625,87.119,99.885c4.045-4.64,33.742-40.807,33.742-40.807
    l0.045,29.485c0,0-43.371,50.696-48.156,56.688s3.5,12.5,9.625,6.375c2.201-2.688,46.757-54.896,48.857-57.531
    c3.976-5.344-1.524-13.427-10.262-5.572c0-0.491-0.079-29.553-0.079-29.553s8.062-9.406,10.453-12.297
    c2.701-3.874,17.156-28.506,17.156-28.506c6.627,0,12,5.373,12,12V170.5z
"/></symbol>
<symbol id="icon_collect"><path d="M181.089,5.722h-77.108c-6.847,0-12.397,5.596-12.397,12.501v73.755l-19.986,0.007V33.85c0-5.178-4.163-9.376-9.297-9.376
    H43.704v-6.251c0-6.904-5.55-12.501-12.396-12.501H18.911c-6.847,0-12.397,5.596-12.397,12.501V39.6
    c0,6.904,5.55,12.501,12.397,12.501h12.397c6.847,0,12.397-5.596,12.397-12.501v-5.75h18.596v58.129H43.704v-7.625
    c0-6.904-5.55-12.501-12.397-12.501H18.911c-6.847,0-12.397,5.596-12.397,12.501v30.252c0,6.904,5.55,12.501,12.397,12.501h12.397
    c6.847,0,12.397-5.596,12.397-12.501v-7.625h18.596v58.129H43.704v-5.75c0-6.904-5.55-12.501-12.397-12.501H18.911
    c-6.847,0-12.397,5.596-12.397,12.501v21.376c0,6.904,5.55,12.501,12.397,12.501h12.397c6.847,0,12.397-5.596,12.397-12.501v-6.251
    h18.596c5.135,0,9.297-4.197,9.297-9.376v-58.093l19.614-0.037v73.755c0,6.904,5.55,12.501,12.397,12.501h77.48
    c6.847,0,12.397-5.596,12.397-12.501V18.223C193.486,11.32,187.936,5.722,181.089,5.722z M34.407,39.6
    c0.017,1.822-1.309,3.374-3.099,3.626H18.911c-1.986,0-3.595-1.623-3.595-3.626V18.223c0.25-1.805,1.788-3.143,3.595-3.125h12.397
    c1.616,0.213,2.888,1.496,3.099,3.125V39.6z M34.903,114.605c0,2.002-1.61,3.626-3.595,3.626H18.911
    c-1.986,0-3.595-1.623-3.595-3.626V84.353c0-2.002,1.61-3.626,3.595-3.626h12.397c1.985,0,3.595,1.623,3.595,3.626V114.605z
     M34.903,180.735c0,2.002-1.61,3.626-3.595,3.626H18.911c-1.789-0.252-3.116-1.804-3.099-3.626v-21.376
    c-0.017-1.822,1.309-3.374,3.099-3.626h12.397c1.985,0,3.595,1.623,3.595,3.626V180.735z M184.56,152.083v28.65
    c0,1.933-1.554,3.5-3.471,3.5c0,0-76.217,0-77.108,0c-0.892,0-3.28-1.715-3.471-3.5l0.006-28.671h15.539V173h20.832v-21.006
    l-36.376,0.001v-31.401l15.544-0.01v20.907h20.832v-21.006l-36.376,0V89.062l15.544-0.016v20.935h20.832V88.976l-36.376,0V57.704
    l15.544-0.047v20.816h20.832V57.466l-36.376,0.175v-31.61l15.544,0.016v20.917h20.832V25.958l-36.376,0v-7.735
    c0.191-1.785,1.691-3.135,3.471-3.125h77.108c1.917,0,3.471,1.567,3.471,3.5v7.36h-37.259v21.006h20.832V26.062l16.427,0.016v31.388
    l-37.259,0v21.006h20.832V57.531h16.427v31.445l-37.259,0v21.006h20.832V89.047l16.427,0.047v31.39l-37.259,0v21.006h20.832v-20.944
    h16.427v31.447l-37.259,0V173h20.832v-20.917H184.56z
        "/>
</symbol>


            </svg>
            {
                this.renderTree(datalist, 1)
            }
        </div>
    }
}

function mapStateToProps(state) {
    return {
        datalist: state.treeView.datalist
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            onToggle: onToggle
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TreeView);