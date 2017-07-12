import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore';
import UserCenter from '../../../src/userCenter/containers/UserCenter';
import {initialState as state} from '../../../src/App/reducer';
import Overlayer from '../../../src/overlayer/containers/overlayer';

describe('<UserCenter /> HOC', () => {
    const store = configureStore();
    it('render normal, test alter password popup', () => {
        const root = mount(<Provider store={store}>
            <div>
                <UserCenter />
                <Overlayer />
            </div>
        </Provider>);
        
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
         const root = mount(<Provider store={store}>
            <div>
                <UserCenter />
                <Overlayer />
            </div>
        </Provider>);

        const li = root.find('.user-list li').at(0);
        li.simulate('click');
        let alterPopup = root.find('AlterPwPopup');
        let btnConfirm = alterPopup.find('.btn.btn-primary');
        btnConfirm.simulate('click');
        alterPopup = root.find("AlterPwPopup");
        expect(alterPopup.length).toBe(0);

    })

    it('test exit popup cancel btn click', () => {
        const root = mount(<Provider store={store}>
            <div>
                <UserCenter />
                <Overlayer />
            </div>
        </Provider>);
        
        const li = root.find('.user-list li').at(1);
        li.simulate('click');

        let exitPopup = root.find('ExitPopup');
        expect(exitPopup.length).toBe(1);
        
        let btnCancel = exitPopup.find('.btn.btn-default');
        btnCancel.simulate('click');
        exitPopup = root.find('ExitPopup');
        expect(exitPopup.length).toBe(0);
    });
})