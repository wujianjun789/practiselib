/**
 * Created by a on 2018/2/1.
 */
import React from 'react';
import Select from '../../components/Select';
import SearchText from '../../components/SearchText';
import PreviewFile from '../component/previewFile';

import {FormattedMessage} from 'react-intl';
const RenderAssetLibTop = props=>{
    const {assetSort, assetSearch, assetListPro, showModalPro, onChange, searchSubmit, assetList, showModal, hideModal, addUploadFile} = props;
    return <div className="top">
        <Select className="asset-sort" data={assetSort}
                onChange={selectedIndex => onChange("assetSort", selectedIndex)}></Select>
        <SearchText className="asset-search" placeholder={assetSearch.get('placeholder')}
                    value={assetSearch.get('value')}
                    onChange={value => onChange("assetSearch", value)}
                    submit={searchSubmit}></SearchText>
        <div className={"btn-group " + (assetListPro.get('isEdit') ? '' : 'hidden')}>
            <button className="btn btn-gray" onClick={() => assetList('edit')}><FormattedMessage id='button.edit'/></button>
            <button className="btn btn-primary add" onClick={showModal}><FormattedMessage id='button.import'/></button>
        </div>
        <div className={"btn-group " + (assetListPro.get('isEdit') ? 'hidden' : '')}>
            <button className="btn btn-gray" onClick={() => assetList('remove')}><FormattedMessage id='button.delete'/>
            </button>
            <button className="btn btn-primary" onClick={() => assetList('complete')}><FormattedMessage id='button.finish'/>
            </button>
        </div>
        <PreviewFile showModal={showModalPro} hideModal={hideModal} addUploadFile={addUploadFile} />
    </div>
}

export default RenderAssetLibTop;