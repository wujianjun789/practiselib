import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';

import ConfirmPopup from '../../../src/components/ConfirmPopup';

const store = configureStore();
describe('<ConfirmPopup />', () => {
    it('default render', () => {
        const click = jest.fn();
        const root = shallow(<Provider store={store}>
                <IntlProvider>
                    <ConfirmPopup tips='tips' iconClass='icon-class' cancel={click} confirm={click}/>
                </IntlProvider>
        </Provider>
        );
        const cmp = root.find('ConfirmPopup');
        let icon = cmp.find('.icon.icon-class');
        expect(icon.length).toBe(1);

        let txt = cmp.find('.tips');
        expect(txt.text()).toBe('tips');

        // let btnCancel = cmp.find('.btn.btn-default');
        // expect(btnCancel.text()).toBe('取消');
        //
        // let btnConfirm = cmp.find('.btn.btn-primary');
        // expect(btnConfirm.text()).toBe('确认');
    });

    it('click simulate', () => {
        const click = jest.fn();
        const cmp = shallow(<Provider store={store}>
            <IntlProvider>
                <ConfirmPopup tips='tips' iconClass='icon-class' cancel={click} confirm={click}/>
            </IntlProvider>
        </Provider>);

        let btnCancel = cmp.find('.btn.btn-default');
        btnCancel.simulate('click');
        expect(click).toHaveBeenCalledTimes(1);

        let btnConfirm = cmp.find('.btn.btn-primary');
        btnConfirm.simulate('click');
        expect(click).toHaveBeenCalledTimes(2);
    });

    it('snapshot', () => {
        const click = jest.fn();
        const cmp = renderer.create(<Provider store={store}>
            <IntlProvider>
                <ConfirmPopup tips='tips' iconClass='icon-class' cancel={click} confirm={click}/>
            </IntlProvider>
        </Provider>);
        let tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
});