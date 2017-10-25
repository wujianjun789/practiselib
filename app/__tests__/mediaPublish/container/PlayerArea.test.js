/**
 * Created by a on 2017/10/23.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import {PlayerArea} from '../../../src/mediaPublish/container/PlayerArea';


test('PlayerArea renders', ()=>{
    const component = renderer.create(
        <PlayerArea />
    )

    let playerArea = component.toJSON();
    expect(playerArea).toMatchSnapshot();
})

test('PlayerArea div click', ()=>{
    const component = shallow(<PlayerArea />)
    expect(component.find('.player-area').length).toEqual(1);
})