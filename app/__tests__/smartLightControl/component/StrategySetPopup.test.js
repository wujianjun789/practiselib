/**
 * Created by a on 2017/9/29.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer';

import StrategySetPopup from '../../../src/smartLightControl/component/StrategySetPopup';

test('renders StrategySetPopup', ()=>{
    const component = renderer.create(
        <StrategySetPopup />
    ).toJSON();

    expect(component).toMatchSnapshot();
});

test('renders StrategySetPopup class', ()=>{
    const component = shallow(<StrategySetPopup />)
    expect(component.find('.strategy-set-popup').length).toEqual(1);
})