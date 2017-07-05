import app, {initialState as state} from '../../../src/App/reducer/index';

test('test app reducer', () => {
    const action = {type: 'UNIT_TEST'};
    expect(app(state, action)).toEqual(state);
});