import overlayer, {initialState as state} from '../../../src/common/reducer/overlayer';
import * as actionTypes from '../../../src/common/actionTypes/overlayer';

describe('overlayer reducer', () => {
    it('overlay', () => {
        expect(overlayer(undefined, { })).toEqual(state);
        expect(overlayer(undefined, { type: actionTypes.OVERLAYER_HIDDEN} )).toEqual({ isShowDialog: false, page: null });
        expect(overlayer(undefined, { type: actionTypes.OVERLAYER_SHOW, page: 'my page' } )).toEqual({ isShowDialog: true, page: 'my page' });
    });
})