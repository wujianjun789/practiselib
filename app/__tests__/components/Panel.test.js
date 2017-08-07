import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import Panel from '../../src/components/Panel';

describe('<Panel />', () => {
    it('render with no props passed', () => {
        const panel = shallow(<Panel />);

        const container = panel.find('.modal-content');
        expect(container.length).toBe(1);

        const tit = panel.find('.modal-title');
        expect(tit.length).toBe(1);
        expect(tit.text()).toBe('');

        expect(panel.find('button.close').length).toBe(0);

        const body = panel.find('.modal-body');
        expect(body.length).toBe(1);
        const bodyChild = body.find('.row.pull-center');
        expect(bodyChild.length).toBe(1);
        expect(bodyChild.text()).toBe('无相关数据');
    });

    it('render with className="modal-default", title=box, text="body text", closeBtn=true', () => {
        const panel = shallow(<Panel className="modal-default" title="box" text="body text" closeBtn/>);

        const container = panel.find('.modal-content');
        expect(container.hasClass('modal-default')).toBeTruthy();

        const tit = panel.find('.modal-title');
        expect(tit.text()).toBe('box');

        expect(panel.find('button.close').length).toBe(1);

        const body = panel.find('.modal-body');
        const bodyChild = body.find('.row.pull-center');
        expect(bodyChild.text()).toBe('body text');
    });

    it('render with body=<div className="test">test</div>, footer=<div className="footer">footer</div>', () => {
        let body = <div className="test">test</div>;
        let footer = <div className="footer">footer</div>;
        const panel = shallow(<Panel body={body} footer={footer}/>);
        
        const bod = panel.find('.test');
        expect(bod.length).toBe(1);
        expect(bod.text()).toBe('test');

        const foot = panel.find('.footer');
        expect(foot.length).toBe(1);
        expect(foot.text()).toBe('footer');
    });

    it('render with children=<div className="test">test</div>', () => {
        const panel = mount(<Panel><div className="test">test</div></Panel>);

        const body = panel.find('.test');
        expect(body.length).toBe(1);
        expect(body.text()).toBe('test');
    });

    it('closeBtn click', () => {
        const click = jest.fn();
        const panel = shallow(<Panel closeClick={click} closeBtn />);
        let closeBtn = panel.find('button.close');
        closeBtn.simulate('click');
        expect(click).toHaveBeenCalledTimes(1);
    })

    it('snapshot with no props passed', () => {
        let cmp = renderer.create(<Panel />);
        let tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('snapshot with className="modal-default", title=box, text="body text", closeBtn=true', () => {
        const panel = renderer.create(<Panel className="modal-default" title="box" text="body text" closeBtn/>);
        let tree = panel.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('snapshot with body=<div className="test">test</div>, footer=<div className="footer">footer</div>', () => {
        let body = <div className="test">test</div>;
        let footer = <div className="footer">footer</div>;
        const panel = renderer.create(<Panel body={body} footer={footer}/>);
        let tree = panel.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('snapshot with children=<div className="test">test</div>', () => {
        let click = jest.fn();
        const panel = renderer.create(<Panel closeClick={click} closeBtn><div className="test">test</div></Panel>);
        let tree = panel.toJSON();
        expect(tree).toMatchSnapshot();
    });
})