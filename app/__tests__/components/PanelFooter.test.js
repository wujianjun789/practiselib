import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import PanelFooter from '../../src/components/PanelFooter';

describe('<PanelFooter />', () => {
    it('render with funcNames=["onCancel","onConfirm"], btnTitles=["Cancel","Confirm"]', () => {
        const cmp = shallow(<PanelFooter funcNames={["onCancel","onConfirm"]} btnTitles={["Cancel","Confirm"]} />);

        const btnCancel = cmp.find('.btn.btn-default');
        expect(btnCancel.length).toBe(1);
        expect(btnCancel.prop('disabled')).not.toBeTruthy();
        expect(btnCancel.text()).toBe('Cancel');

        const btnConfirm = cmp.find('.btn.btn-primary');
        expect(btnConfirm.length).toBe(1);
        expect(btnConfirm.prop('disabled')).not.toBeTruthy();
        expect(btnConfirm.text()).toBe('Confirm');
    });

    it('render with funcNames=["onCancel","onConfirm"], btnTitles=["Cancel","Confirm"],btnDisabled={[true, true]},btnClassName={["btn-custom1","btn-custom2"]}' , () => {
        const cmp = shallow(<PanelFooter funcNames={["onCancel","onConfirm"]} btnTitles={["Cancel","Confirm"]} btnDisabled={[true, true]} btnClassName={["btn-custom1","btn-custom2"]}/>);

        const btnCancel = cmp.find('.btn.btn-custom1');
        expect(btnCancel.length).toBe(1);
        expect(btnCancel.prop('disabled')).toBeTruthy();
        expect(btnCancel.text()).toBe('Cancel');

        const btnConfirm = cmp.find('.btn.btn-custom2');
        expect(btnConfirm.length).toBe(1);
        expect(btnConfirm.prop('disabled')).toBeTruthy();
        expect(btnConfirm.text()).toBe('Confirm');
    });

    it('btn click', () => {
        const click = jest.fn();
        const cmp = shallow(<PanelFooter funcNames={["onCancel","onConfirm"]} btnTitles={["Cancel","Confirm"]} onCancel={click} onConfirm={click}/>);

        const btnCancel = cmp.find('.btn.btn-default');
        btnCancel.simulate('click');
        expect(click).toHaveBeenCalledTimes(1);

        const btnConfirm = cmp.find('.btn.btn-primary');
        btnConfirm.simulate('click');
        expect(click).toHaveBeenCalledTimes(2);
    });

    it('snapshot with funcNames=["onCancel","onConfirm"], btnTitles=["Cancel","Confirm"]', () => {
        const cmp = renderer.create(<PanelFooter funcNames={["onCancel","onConfirm"]} btnTitles={["Cancel","Confirm"]} />);
        let tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('snapshot with funcNames=["onCancel","onConfirm"], btnTitles=["Cancel","Confirm"],btnDisabled={[true, true]},btnClassName={["btn-custom1","btn-custom2"]}', () => {
        const cmp = renderer.create(<PanelFooter funcNames={["onCancel","onConfirm"]} btnTitles={["Cancel","Confirm"]} btnDisabled={[true, true]} btnClassName={["btn-custom1","btn-custom2"]}/>);
        let tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    })
})