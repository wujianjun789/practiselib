import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from '../app/container/index'
import Login from '../login/container/Login'
import AssetManage from '../assetManage/container/index'
import DomainManage from '../domainManage/container/index'
import PermissionManage from '../permissionManage/container/index'
import SystemOperation from '../systemOperation/container/index'
import SmartLightManage from '../smartLightManage/container/index'
import LightManage from '../lightManage/container/index'
import ReporterManage from '../reporterManage';
import MediaPublish from '../mediaPublish/container/index';

import { isAuthenticated, isAdmined, isLogged } from '../authentication/authWrapper'
const Authenticated = isAuthenticated(props => props.children);
const Admined = isAdmined(props => props.children);
const Logged = isLogged(props => props.children);

export default (
<Route>
  <Route component={ Logged }>
    <Route path="/login" component={ Login }></Route>
  </Route>
  <Route component={ Authenticated }>
    <Route path="/" component={ App }></Route>
    <Route path="/assetManage" component={ AssetManage }>
      <Route path="model">
        <Route path="lc" getComponent={ (nextState, cb) => {
                                            require.ensure([], (require) => {
                                                cb(null, require('../assetManage/container/SingleLamp').default)
                                            }, 'starriverpro.assetmanage.singleLamp')
                                        } } />
        <Route path="gateway" getComponent={ (nextState, cb) => {
                                             require.ensure([], (require) => {
                                                 cb(null, require('../assetManage/container/Gateway').default)
                                             }, 'starriverpro.assetmanage.gateway')
                                         } } />
        <Route path="sensor" getComponent={ (nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../assetManage/container/Sensor').default)
                                                }, 'starriverpro.assetmanage.sensor')
                                            } } />
        <Route path="screen" getComponent={ (nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../assetManage/container/Screen').default)
                                                }, 'starriverpro.assetmanage.screen')

                                            } } />
        <Route path="pole" getComponent={ (nextState, cb) => {
                                              require.ensure([], (require) => {
                                                  cb(null, require('../assetManage/container/Pole').default)
                                              }, 'starriverpro.assetmanage.pole')
                                          } } />
        <Route path="xes" getComponent={ (nextState, cb) => {
                                                 require.ensure([], (require) => {
                                                     cb(null, require('../assetManage/container/Xes').default)
                                                 }, 'starriverpro.assetmanage.xes')
                                             } } />
      </Route>
      <Route path="statistics">
        <Route path="lc" getComponent={ (nextState, cb) => {
                                            require.ensure([], (require) => {
                                                cb(null, require('../assetStatistics/container/SingleLamp').default)
                                            }, 'starriverpro.assetmanage.singleLamp')
                                        } } />
        <Route path="gateway" getComponent={ (nextState, cb) => {
                                             require.ensure([], (require) => {
                                                 cb(null, require('../assetStatistics/container/Gateway').default)
                                             }, 'starriverpro.assetmanage.gateway')
                                         } } />
        <Route path="sensor" getComponent={ (nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../assetStatistics/container/Sensor').default)
                                                }, 'starriverpro.assetmanage.sensor')
                                            } } />
        <Route path="screen" getComponent={ (nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../assetStatistics/container/Screen').default)
                                                }, 'starriverpro.assetmanage.screen')
                                            } } />
        <Route path="pole" getComponent={ (nextState, cb) => {
                                              require.ensure([], (require) => {
                                                  cb(null, require('../assetStatistics/container/Pole').default)
                                              }, 'starriverpro.assetmanage.pole')
                                          } } />
        <Route path="xes" getComponent={ (nextState, cb) => {
                                                 require.ensure([], (require) => {
                                                     cb(null, require('../assetStatistics/container/Xes').default)
                                                 }, 'starriverpro.assetmanage.xes')
                                             } } />
      </Route>
    </Route>
    <Route path="/domainManage" component={ DomainManage }>
      <Route path="domainEdit">
        <Route path="list" getComponent={ (nextState, cb) => {
                                              require.ensure([], (require) => {
                                                  cb(null, require('../domainManage/container/DomainEditList').default)
                                              }, 'starriverpro.domainmanage.domainEditList')
                                          } } />
        <Route path="topology" getComponent={ (nextState, cb) => {
                                                  require.ensure([], (require) => {
                                                      cb(null, require('../domainManage/container/DomainEditTopology').default)
                                                  }, 'starriverpro.domainmanage.domainEditTopology')
                                              } } />
      </Route>
      <Route path="mapPreview" getComponent={ (nextState, cb) => {
                                                  require.ensure([], (require) => {
                                                      cb(null, require('../domainMapPreview/container/MapPreview').default)
                                                  }, 'starriverpro.domainmappreview.mappreview')
                                              } } />
    </Route>
    <Route component={ Admined }>
      <Route path="/permissionManage" component={ PermissionManage }></Route>
    </Route>
    <Route path="/systemOperation" component={ SystemOperation }>
      <Route path="config">
        <Route path="gateway" getComponent={ (nextState, cb) => {
                                             require.ensure([], (require) => {
                                                 cb(null, require('../systemOperation/container/gateway').default)
                                             }, 'starriverpro.systemoperation.gateway')
                                         } } />
        <Route path="lc" getComponent={ (nextState, cb) => {
                                            require.ensure([], (require) => {
                                                cb(null, require('../systemOperation/container/SingleLampCon').default)
                                            }, 'starriverpro.systemoperation.singlelampcontroller')
                                        } } />
        <Route path="sensor" getComponent={ (nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../systemOperation/container/Sensor').default)
                                                }, 'starriverpro.systemoperation.sensor')
                                            } } />
        <Route path="screen" getComponent={ (nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../systemOperation/container/Screen').default)
                                                }, 'starriverpro.systemoperation.screen')
                                            } } />
        <Route path="xes" getComponent={(nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../systemOperation/container/Xes').default)
                                                }, 'starriverpro.systemoperation.xes')
                                            } }/>
        <Route path="pole" getComponent={(nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../systemOperation/container/Pole').default)
                                                }, 'starriverpro.systemoperation.pole')
                                            } }/>
      </Route>
      <Route path="strategy">
        <Route path="timeTable" getComponent={ (nextState, cb) => {
                                                   require.ensure([], (require) => {
                                                       cb(null, require('../controlStrategy/container/TimeStrategy').default)
                                                   }, 'starriverpro.controlstrategy.timestrategy')
                                               } } />
        <Route path="sensor" getComponent={ (nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../controlStrategy/container/SensorStrategy').default)
                                                }, 'starriverpro.controlstrategy.sensortrategy')
                                            } } />
        <Route path="latlng" getComponent={ (nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../controlStrategy/container/LatlngStrategy').default)
                                                }, 'starriverpro.controlstrategy.latlngtrategy')
                                            } } />
      </Route>
      <Route path="serviceMonitor">
        <Route path="systemRunningState" getComponent={(nextState, cb)=>{
                                              require.ensure([], require=>{
                                                  cb(null, require('../serviceMonitoring/container/SystemRunningState').default)
                                              }, 'starriverpro.serviceMonitoring.systemRunningState')
                                          }}/>
        <Route path="serviceState" getComponent={(nextState, cb)=>{
                                              require.ensure([], require=>{
                                                  cb(null, require('../serviceMonitoring/container/ServiceState').default)
                                              }, 'starriverpro.serviceMonitoring.serviceState')
                                          }}/>
      </Route>
      <Route path="systemConfig">
        <Route path="sysConfigSmartLight" getComponent={ (nextState, cb) => {
                                                             require.ensure([], require => {
                                                                 cb(null, require('../systemConfig/container/sysConfigSmartLight').default)
                                                             }, 'starriverpro.systemconfig.sysConfigSmartLight')
                                                         } } />
        <Route path="sysConfigScene" getComponent={ (nextState, cb) => {
                                                             require.ensure([], require => {
                                                                 cb(null, require('../systemConfig/container/sysConfigScene').default)
                                                             }, 'starriverpro.systemconfig.sysConfigScene')
                                                         } } />
      </Route>
      <Route path="deviceMonitor">
        <Route path="deviceTopology" getComponent={ (nextState, cb) => {
                                                        require.ensure([], (require) => {
                                                            cb(null, require('../deviceMonitor/container/DeviceTopology').default)
                                                        }, 'starriverpro.deviceMonitor.deviceTopology')
                                                    } } />
        <Route path="deviceState" getComponent={ (nextState, cb) => {
                                                     require.ensure([], (require) => {
                                                         cb(null, require('../deviceMonitor/container/DeviceStateChart').default)
                                                     }, 'starriverpro.deviceMonitor.deviceStateChart')
                                                 } } />
      </Route>
      <Route path="deviceMaintenance">
        <Route path="deviceReplace" getComponent={ (nextState, cb) => {
                                             require.ensure([], (require) => {
                                                 cb(null, require('../deviceMaintenance/container/DeviceReplace').default)
                                             }, 'starriverpro.deviceMaintenance.deviceReplace')
                                         } } />
        <Route path="deviceUpdate" getComponent={ (nextState, cb) => {
                                            require.ensure([], (require) => {
                                                cb(null, require('../deviceMaintenance/container/DeviceUpdate').default)
                                            }, 'starriverpro.deviceMaintenance.deviceUpdate')
                                        } } />
      </Route>
    </Route>
    <Route path="/smartLight" component={ SmartLightManage }>
      <Route path="map" getComponent={ (nextState, cb) => {
                                           require.ensure([], (require) => {
                                               cb(null, require('../smartLightManage/container/SmartLightMap').default)
                                           }, 'starriverpro.smartLightManage.smartLightMap')
                                       } } />
      <Route path="list">
        <IndexRoute getComponent={ (nextState, cb) => {
                                       require.ensure([], (require) => {
                                           cb(null, require('../smartLightList/containers/SingleLampCon').default);
                                       }, 'starriverpro.smartLightList.SingleLampCon');
                                   } } />
        <Route path="gateway" getComponent={ (nextState, cb) => {
                                             require.ensure([], (require) => {
                                                 cb(null, require('../smartLightList/containers/Gateway').default);
                                             }, 'starriverpro.smartLightList.Gateway');
                                         } } />
        <Route path="sensor" getComponent={ (nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../smartLightList/containers/Sensor').default);
                                                }, 'starriverpro.smartLightList.Sensor');
                                            } } />
        <Route path="screen" getComponent={ (nextState, cb) => {
                                                require.ensure([], (require) => {
                                                    cb(null, require('../smartLightList/containers/Screen').default);
                                                }, 'starriverpro.smartLightList.Screen');
                                            } } />
        <Route path="chargePole" getComponent={ (nextState, cb) => {
                                                 require.ensure([], (require) => {
                                                     cb(null, require('../smartLightList/containers/ChargePole').default);
                                                 }, 'starriverpro.smartLightList.ChargePole');
                                             } } />
        <Route path="xes" getComponent={ (nextState, cb) => {
                                                 require.ensure([], (require) => {
                                                     cb(null, require('../smartLightList/containers/Xes').default);
                                                 }, 'starriverpro.smartLightList.Xes');
                                             } } />
      </Route>
      <Route path="control">
        <Route path="scene" getComponent={ (nextState, cb) => {
                                               require.ensure([], (require) => {
                                                   cb(null, require('../smartLightControl/container/Scene').default)
                                               }, 'starriverpro.smartLightControl.scene')
                                           } } />
        <Route path="strategy" getComponent={ (nextState, cb) => {
                                                  require.ensure([], (require) => {
                                                      cb(null, require('../smartLightControl/container/Strategy').default)
                                                  }, 'starriverpro.smartLightControl.strategy')
                                              } } />
      </Route>
    </Route>
    <Route path="/light" component={LightManage}>
      <Route path="map" getComponent={(nextState, cb)=>{
                      require.ensure([], (require) => {
                            cb(null, require('../lightManage/container/lightMap').default)
                        }, 'starriverpro.lightManage.lightMap')
                }}/>
      <Route path="list">
        <IndexRoute getComponent={ (nextState, cb) => {
                                       require.ensure([], (require) => {
                                           cb(null, require('../lightList/containers/SingleLampCon').default);
                                       }, 'starriverpro.lightList.SingleLampCon');
                                   } } />
        <Route path="gateway" getComponent={ (nextState, cb) => {
                                             require.ensure([], (require) => {
                                                 cb(null, require('../lightList/containers/Gateway').default);
                                             }, 'starriverpro.lightList.Gateway');
                                         } } />
      </Route>
      <Route path="control">
        <Route path="scene" getComponent={ (nextState, cb) => {
                                               require.ensure([], (require) => {
                                                   cb(null, require('../lightControl/container/Scene').default)
                                               }, 'starriverpro.lightControl.scene')
                                           } } />
        <Route path="strategy" getComponent={ (nextState, cb) => {
                                                  require.ensure([], (require) => {
                                                      cb(null, require('../lightControl/container/Strategy').default)
                                                  }, 'starriverpro.lightControl.strategy')
                                              } } />
      </Route>
	</Route>
	<Route path="/reporterManage" component={ReporterManage}>
		<Route path="device">
			<IndexRoute getComponent={(nextState, cb) => {
				require.ensure([], require => {
					cb(null, require('../reporterManage/device/containers/Brightness').default);
				}, 'starriverpro.reporterManage.device.brightness');
			}} />
			<Route path="amp" getComponent={(nextState, cb) => {
				require.ensure([], require => {
					cb(null, require('../reporterManage/device/containers/Amp').default);
				}, 'starriverpro.reporterManage.device.amp');
			}} />
			<Route path="voltage" getComponent={(nextState, cb) => {
				require.ensure([], require => {
					cb(null, require('../reporterManage/device/containers/Voltage').default);
				}, 'starriverpro.reporterManage.device.voltage');
			}} />
			<Route path="power" getComponent={(nextState, cb) => {
				require.ensure([], require => {
					cb(null, require('../reporterManage/device/containers/Power').default);
				}, 'starriverpro.reporterManage.device.power');
			}} />
			<Route path="sensor" getComponent={(nextState, cb) => {
				require.ensure([], require => {
					cb(null, require('../reporterManage/device/containers/Sensor').default);
				}, 'starriverpro.reporterManage.device.sensor');
			}} />
		</Route>
	</Route>
    <Route path="/mediaPublish" component={MediaPublish}>
		<Route path="playerList">
			<IndexRoute getComponent={(nextState, cb) => {
				require.ensure([], require => {
					cb(null, require('../mediaPublish/container/PlayerList').default);
				}, 'starriverpro.mediaPublish.container.PlayerList');
			}} />
		</Route>
        <Route path="playerArea" getComponent={(nextState, cb)=>{
            require.ensure([], require=>{
                cb(null, require('../mediaPublish/container/PlayerArea').default);
            }, 'starriverpro.mediaPublish.container.PlayerArea');
        }}/>

        <Route path="publish" getComponent={(nextState, cb)=>{
            require.ensure([], require => {
					cb(null, require('../mediaPublishManage/container/PublishManage').default);
				}, 'starriverpro.mediaPublishManage.container.PublishManage');
          }}/>
	</Route>
  </Route>
  <Route path="*" getComponent={ (nextState, cb) => {
                                     require.ensure([], (require) => {
                                         cb(null, require('../common/containers/NoMatch').default)
                                     }, 'nomatch')
                                 } } />
</Route>
)

/*<Route path="/home" getComponent={(nextState, cb) => {
 require.ensure([], (require) => {
 cb(null, require('./pages/Home').default)
 }, 'home')
 } }/>
 <Route path="/about" getComponent={(nextState, cb) => {
 require.ensure([], (require) => {
 cb(null, require('./pages/About').default)
 }, 'about')
 } }/>
 <Route path="/course" getComponent={(nextState, cb) => {
 require.ensure([], (require) => {
 cb(null, require('./pages/Course').default)
 }, 'about')
 } }/>*/
