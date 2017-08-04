import Immutable from 'immutable';
import {
    SYSTEM_OPERATION_DOMAIN_SELECT_CHANGE,
    SYSTEM_OPERATION_PAGE_CHANGE
} from '../actionType/lampConCenter';

const initialState = Immutable.fromJS({
    domain: {
        value: '',
        list: [
            {value: 'domain1'},
            {value: 'domain2'},
            {value: 'domain3'},
            {value: 'domain4'},
            {value: 'domain5'},
            {value: 'domain6'},
            {value: 'domain7'},
            {value: 'domain8'},
            {value: 'domain9'},
            {value: 'domain10'},
            {value: 'domain11'},
        ]
    },
    

    page: {
        pageSize: 10,
        current: 1,
        total: 21
    },
    data: [
        {id:1,deviceName: '灯集中控制器', model: '001', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
        {id:2,deviceName: '灯集中控制器', model: '002', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
        {id:3,deviceName: '灯集中控制器', model: '003', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
        {id:4,deviceName: '灯集中控制器', model: '004', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
        {id:5,deviceName: '灯集中控制器', model: '005', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
        {id:6,deviceName: '灯集中控制器', model: '006', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
        {id:7,deviceName: '灯集中控制器', model: '007', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
        {id:8,deviceName: '灯集中控制器', model: '008', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
        {id:9,deviceName: '灯集中控制器', model: '009', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
        {id:10,deviceName: '灯集中控制器', model: '010', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
        {id:11,deviceName: '灯集中控制器', model: '011', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'}
    ],
    popupInfo: {
        data: [
            {id:1,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:2,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:3,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:4,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:5,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:6,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:7,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:8,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:9,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:10,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:11,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'}
        ]
    }
})

export default function lampConCenter(state=initialState, action) {
    switch(action.type) {
        case SYSTEM_OPERATION_DOMAIN_SELECT_CHANGE:
            let val = state.get('domain').get('list').get(action.index).get('value');
            state = state.updateIn(['domain','value'], () => val);
            return state;
        case SYSTEM_OPERATION_PAGE_CHANGE:
            state = state.updateIn(['page', 'current'], () => action.current);
            return state;
        default:
            return state;
    }
}