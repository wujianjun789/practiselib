import app, {initialState as state} from '../../../src/app/reducer/index';

test('test app reducer', () => {
    expect(app(undefined, {})).toEqual(state);
});