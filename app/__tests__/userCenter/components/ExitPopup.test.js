import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import ExitPopup from '../../../src/components/ExitPopup';

describe('<ExitPopup />', () => {
    it('default render', () => {
        const click = jest.fn();
        const cmp = shallow(<ExitPopup cancel={click} confirm={click}/>);

        let icon = cmp.find('.icon.icon-popup-exit');
        expect(icon.length).toBe(1);

        let txt = cmp.find('.tips');
        expect(txt.text()).toBe('是否退出？');

        let btnCancel = cmp.find('.btn.btn-default');
        expect(btnCancel.text()).toBe('Cancel');

        let btnConfirm = cmp.find('.btn.btn-primary');
        expect(btnConfirm.text()).toBe('Confirm');
    });

    it('click simulate', () => {
        const click = jest.fn();
        const cmp = shallow(<ExitPopup cancel={click} confirm={click}/>);

        let btnCancel = cmp.find('.btn.btn-default');
        btnCancel.simulate('click');
        expect(click).toHaveBeenCalledTimes(1);

        let btnConfirm = cmp.find('.btn.btn-primary');
        btnConfirm.simulate('click');
        expect(click).toHaveBeenCalledTimes(2);
    });

    it('snapshot', () => {
        const click = jest.fn();
        const cmp = renderer.create(<ExitPopup cancel={click} confirm={click}/>);
        let tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
});