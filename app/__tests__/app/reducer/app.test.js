import app, {initialState as state} from '../../../src/App/reducer/index';

test('test app reducer', () => {
    expect(app(undefined, {})).toEqual(state);
});