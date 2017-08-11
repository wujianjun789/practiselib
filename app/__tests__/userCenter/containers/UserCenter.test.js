jest.mock('../../../src/api/modifyPassword.js');

import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore';
import UserCenter from '../../../src/common/containers/UserCenter';
import {initialState as state} from '../../../src/app/reducer';
import Overlayer from '../../../src/common/containers/Overlayer';


global.document.cookie = 'user={"id":"mFAqEoHKT6Hn8dHQAlCd1e51uiCkqO7LoGL9GR7VVXnBIeZHuFPR6rhkMYk3kHhw","ttl":1209600,"created":"2017-08-10T00:31:25.860Z","userId":1}'

describe('<UserCenter /> HOC', () => {
    const store = configureStore();
    function setup() {
        const props = {
            router: {
                push: jest.fn()
            }
        }

        const root = mount(<Provider store={store}>
            <div>
                <UserCenter {...props}/>
                <Overlayer />
            </div>
        </Provider>);

        return {
            props,
            root
        }
    }
    
    it('render normal, test alter password popup', () => {
        const {props, root} = setup();
        
        const li = root.find('.user-list li').at(0);
        li.simulate('click');

        let alterPopup = root.find('AlterPwPopup');
        expect(alterPopup.length).toBe(1);
        expect(alterPopup.prop('className')).toBe('alter-pw-popup');

        let btnCancel = alterPopup.find('.btn.btn-default');
        btnCancel.simulate('click');
        alterPopup = root.find('AlterPwPopup');
        expect(alterPopup.length).toBe(0);
    });

    it('alter Popup confirm btn click', () => {

        const {props, root} = setup();

        const li = root.find('.user-list li').at(0);
        li.simulate('click');
        let alterPopup = root.find('AlterPwPopup');
        alterPopup.find('#oldPw').simulate('change',{target: {value: 'admin', id: 'oldPw'}});
        alterPopup.find('#newPw').simulate('change',{target: {value: 'admin01', id: 'newPw'}});
        alterPopup.find('#repPw').simulate('change',{target: {value: 'admin01', id: 'repPw'}});
        let btnConfirm = alterPopup.find('.btn.btn-primary');
        btnConfirm.simulate('click');
        expect(props.router.push.mock.calls.length).toBe(1);

        li.simulate('click');
        alterPopup = root.find('AlterPwPopup');
        alterPopup.find('#oldPw').simulate('change',{target: {value: 'admin01', id: 'oldPw'}});
        alterPopup.find('#newPw').simulate('change',{target: {value: 'admin01', id: 'newPw'}});
        alterPopup.find('#repPw').simulate('change',{target: {value: 'admin01', id: 'repPw'}});
        btnConfirm = alterPopup.find('.btn.btn-primary');
        btnConfirm.simulate('click');
        expect(props.router.push.mock.calls.length).toBe(1);
    })

    it('test exit popup cancel btn click', () => {
        const {props, root} = setup();
        
        const li = root.find('.user-list li').at(1);
        li.simulate('click');

        let exitPopup = root.find('ConfirmPopup');
        expect(exitPopup.length).toBe(1);
        
        let btnCancel = exitPopup.find('.btn.btn-default');
        btnCancel.simulate('click');
        exitPopup = root.find('ConfirmPopup');
        expect(exitPopup.length).toBe(0);
    });
})