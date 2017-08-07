import Immutable from 'immutable';
import {
    SYSTEM_OPERATION_DOMAIN_SELECT_CHANGE,
    SYSTEM_OPERATION_PAGE_CHANGE
} from '../actionType/lampConCenter';

const initialState = Immutable.fromJS({
    domain: {
        value: '',
        titleField: 'value',
        valueField: 'value',
        options: [
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
        whiteListData: [
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
        ],
        domainList: {
            titleField: 'title',
            valueField: 'value',
            options: [
                {id: 1, title: 'domain01', value: 'domain01'},
                {id: 2, title: 'domain02', value: 'domain02'},
                {id: 3, title: 'domain03', value: 'domain03'},
                {id: 4, title: 'domain04', value: 'domain04'},
                {id: 5, title: 'domain05', value: 'domain05'},
                {id: 6, title: 'domain06', value: 'domain06'},
                {id: 7, title: 'domain07', value: 'domain07'}
            ]
        },
        modelList: {
            titleField: 'title',
            valueField: 'value',
            options: [
                {id: 1, title: 'model01', value: 'model01'},
                {id: 2, title: 'model02', value: 'model02'},
                {id: 3, title: 'model03', value: 'model03'},
                {id: 4, title: 'model04', value: 'model04'},
                {id: 5, title: 'model05', value: 'model05'},
                {id: 6, title: 'model06', value: 'model06'},
                {id: 7, title: 'model07', value: 'model07'}
            ]
        }
    }
})

export default function lampConCenter(state=initialState, action) {
    switch(action.type) {
        case SYSTEM_OPERATION_DOMAIN_SELECT_CHANGE:
            state = state.updateIn(['domain','value'], () => action.value);
            return state;
        case SYSTEM_OPERATION_PAGE_CHANGE:
            state = state.updateIn(['page', 'current'], () => action.current);
            return state;
        default:
            return state;
    }
}