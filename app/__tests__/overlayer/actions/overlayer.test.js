import * as overlayer from '../../../src/overlayer/actions/overlayer';
import * as actionTypes from '../../../src/overlayer/actionTypes/overlayer';

describe('overlayer action creators', () => {
    let page = 'my page';
    it('overlayerShow', () => {
        expect(overlayer.overlayerShow(page)).toEqual({type: actionTypes.OVERLAYER_SHOW, page});
    })

    it('overlayerHide', () => {
        expect(overlayer.overlayerHide()).toEqual({type: actionTypes.OVERLAYER_HIDDEN});
    })
})