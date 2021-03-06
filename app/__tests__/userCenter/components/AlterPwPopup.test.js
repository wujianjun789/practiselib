import React from 'react';
import {shallow, mount} from 'enzyme';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';
import renderer from 'react-test-renderer';
import AlterPwPopup from '../../../src/components/AlterPwPopup';
import PanelFooter from '../../../src/components/PanelFooter';

const store = configureStore();
describe('<AlterPwPopup />', () => {
    it('default render', () => {
        const cmp = mount(<Provider store={store}>
            <IntlProvider>
                <AlterPwPopup/>
            </IntlProvider>
        </Provider>);
        console.log(cmp);
        let panel = cmp.find('Panel');
        expect(panel.length).toBe(1);
        // expect(panel.props().title).toBe('修改密码');
        expect(panel.props().closeBtn).toBeTruthy();

        let oldInput = cmp.find('#oldPw');
        // expect(oldInput.prop('placeholder')).toBe('输入旧密码');
        expect(oldInput.props().value).toBe('');
        oldInput.simulate('change', {target: {value: 'oldPw', id: 'oldPw'}});
        oldInput = cmp.find('#oldPw');
        expect(oldInput.props().value).toBe('oldPw');

        let newInput = cmp.find('#newPw');
        // expect(newInput.prop('placeholder')).toBe('输入新密码');
        expect(newInput.props().value).toBe('');
        newInput.simulate('change', {target: {value: 'newPw', id: 'newPw'}});
        newInput = cmp.find('#newPw');
        expect(newInput.props().value).toBe('newPw');

        let repInput = cmp.find('#repPw');
        // expect(repInput.prop('placeholder')).toBe('请再次输入密码');
        expect(repInput.props().value).toBe('');
        repInput.simulate('change', {target: {value: 'repPw', id: 'repPw'}});
        repInput = cmp.find('#repPw');
        expect(repInput.props().value).toBe('repPw');
    });

    // it('renderer with className="alter-pw"', () => {
    //     const cmp = shallow(<AlterPwPopup className="alter-pw"/>);
    //     expect(cmp.find('.alter-pw').length).toBe(1);
    // });

    // it('snapshot', () => {
    //     const cmp = renderer.create(<AlterPwPopup />);
    //     const tree = cmp.toJSON();
    //     expect(tree).toMatchSnapshot();
    // });
})