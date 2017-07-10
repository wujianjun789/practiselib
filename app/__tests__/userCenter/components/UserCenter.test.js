import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import {UserCenter} from '../../../src/userCenter/containers/UserCenter';

describe('<UserCenter />', () => {
    it('render with props.className=undefined', () => {
        const userCenter = shallow(<UserCenter />);
        const container = userCenter.find('div.user-center');
        expect(container.length).toBe(1);

        const userIcon = container.find('.user-icon.clearfix');
        expect(userIcon.length).toBe(1);

        const icon = userIcon.find('.icon.icon-usr');
        expect(icon.length).toBe(1);

        const _ul = container.find('ul.user-list');
        expect(_ul.length).toBe(1);

        const ul_hidden = container.find('.user-list.hidden');
        expect(ul_hidden.length).toBe(1);

        const _li = _ul.find('li');
        expect(_li.length).toBe(2);

        expect(_li.at(0).text()).toBe('修改密码');
        expect(_li.at(1).text()).toBe('退出管理系统')

        const span0 = _li.at(0).find('.icon.icon-alter');
        expect(span0.length).toBe(1);

        const span1 = _li.at(1).find('.icon.icon-exit');
        expect(span1.length).toBe(1);
    });

    it('render with props.className="user-center"', () => {
        const userCenter = shallow(<UserCenter className="user_center" />);
        const container = userCenter.find('div.user-center');
        expect(container.length).toBe(1);
        expect(container.prop('className')).toBe('user-center user_center');
    });

    it('user Info list toggle', () => {
        let userCenter = shallow(<UserCenter/>);
        let head_right = userCenter.find('.user-center');

        let ul_hidden = userCenter.find('.user-list');
        expect(ul_hidden.hasClass('hidden')).toBe(true);

        head_right.simulate('click');

        ul_hidden = userCenter.find('.user-list');
        expect(ul_hidden.hasClass('hidden')).not.toBe(true);

    });

    it('user Info list toggle snapshot', () => {
        const userCenter = renderer.create(<UserCenter/>);
        let tree = userCenter.toJSON();

        expect(tree).toMatchSnapshot();
        
        tree.props.onClick();
        tree = userCenter.toJSON();
        expect(tree).toMatchSnapshot();

        tree.props.onClick();
        tree = userCenter.toJSON();
        expect(tree).toMatchSnapshot();
    });
});