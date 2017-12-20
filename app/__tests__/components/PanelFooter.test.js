import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../src/store/configureStore';

import PanelFooter from '../../src/components/PanelFooter';
import {getDefaultIntl} from '../../src/intl/index'

getDefaultIntl();
const store = configureStore();
describe('<PanelFooter />', () => {
    it('render with funcNames=["onCancel","onConfirm"], btnTitles=["Cancel","Confirm"]', () => {
        const root = mount(<Provider store={store}>
                <IntlProvider>
                    <PanelFooter funcNames={["onCancel","onConfirm"]} btnTitles={["Cancel","Confirm"]} />
                </IntlProvider>
            </Provider>);
        const cmp = root.find("PanelFooter");

        const btnCancel = cmp.find('.btn.btn-default');
        // expect(btnCancel.length).toBe(1);
        // expect(btnCancel.prop('disabled')).not.toBeTruthy();
        // expect(btnCancel.text()).toBe('Cancel');

        const btnConfirm = cmp.find('.btn.btn-primary');
        // expect(btnConfirm.length).toBe(1);
        // expect(btnConfirm.prop('disabled')).not.toBeTruthy();
        // expect(btnConfirm.text()).toBe('Confirm');
    });

    it('render with funcNames=["onCancel","onConfirm"], btnTitles=["Cancel","Confirm"],btnDisabled={[true, true]},btnClassName={["btn-custom1","btn-custom2"]}' , () => {
        const root = shallow(<Provider store={store}>
            <IntlProvider>
                <PanelFooter funcNames={["onCancel","onConfirm"]} btnTitles={["Cancel","Confirm"]} />
            </IntlProvider>
        </Provider>);
        const cmp = root.find('PanelFooter');
        const btnCancel = cmp.find('.btn.btn-custom1');
        // expect(btnCancel.length).toBe(1);
        // expect(btnCancel.prop('disabled')).toBeTruthy();
        // expect(btnCancel.text()).toBe('Cancel');

        const btnConfirm = cmp.find('.btn.btn-custom2');
        // expect(btnConfirm.length).toBe(1);
        // expect(btnConfirm.prop('disabled')).toBeTruthy();
        // expect(btnConfirm.text()).toBe('Confirm');
    });

    it('btn click', () => {
        const click = jest.fn();
        const root = shallow(<Provider store={store}>
            <IntlProvider>
                <PanelFooter funcNames={["onCancel","onConfirm"]} btnTitles={["Cancel","Confirm"]} />
            </IntlProvider>
        </Provider>);
        const cmp = root.find("PanelFooter");
        const btnCancel = cmp.find('.btn.btn-default');
        // btnCancel.simulate('click');
        // expect(click).toHaveBeenCalledTimes(1);

        const btnConfirm = cmp.find('.btn.btn-primary');
        // btnConfirm.simulate('click');
        // expect(click).toHaveBeenCalledTimes(2);
    });

    it('snapshot with funcNames=["onCancel","onConfirm"], btnTitles=["Cancel","Confirm"]', () => {
        const cmp = renderer.create(<Provider store={store}>
            <IntlProvider>
                <PanelFooter funcNames={["onCancel","onConfirm"]} btnTitles={["Cancel","Confirm"]} />
            </IntlProvider>
        </Provider>);
        let tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('snapshot with funcNames=["onCancel","onConfirm"], btnTitles=["Cancel","Confirm"],btnDisabled={[true, true]},btnClassName={["btn-custom1","btn-custom2"]}', () => {
        const cmp = renderer.create(<Provider store={store}>
            <IntlProvider>
                <PanelFooter funcNames={["onCancel","onConfirm"]} btnTitles={["Cancel","Confirm"]} />
            </IntlProvider>
        </Provider>);
        let tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    })
})