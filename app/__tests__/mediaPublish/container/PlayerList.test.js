/**
 * Created by a on 2017/10/18.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import PlayerList from '../../../src/mediaPublish/container/PlayerList';


test('DomainEdit renders', ()=>{
    const component = renderer.create(
        <PlayerList />
    )

    let playerList = component.toJSON();
    expect(playerList).toMatchSnapshot();
})

test('DomainEdit div click', ()=>{
    const component = shallow(<PlayerList />)
    expect(component.find('.heading').length).toEqual(1);
    expect(component.find('.playerList-container').length).toEqual(1);
})