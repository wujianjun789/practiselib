/**
 * Created by a on 2018/2/1.
 */
import React from 'react';
import Select from '../../components/Select';
import SearchText from '../../components/SearchText';

import {FormattedMessage} from 'react-intl';
const RenderAssetLibTop = props=>{
    const {assetSort, assetSearch, assetListPro, showModalPro, onChange, searchSubmit, assetList, showModal, hideModal, addUploadFile} = props;
    return <div className="top">
        {/*<Select className="asset-sort" data={assetSort}
                onChange={selectedIndex => onChange("assetSort", selectedIndex)}></Select>*/}
        <SearchText className="asset-search" placeholder={assetSearch.get('placeholder')}
                    value={assetSearch.get('value')}
                    onChange={value => onChange("assetSearch", value)}
                    submit={searchSubmit}></SearchText>
        <div className={"btn-group pull-right " + (assetListPro.get('isEdit') ? '' : 'hidden')}>
            <button className="btn btn-gray" onClick={() => assetList('edit')}><FormattedMessage id='button.edit'/></button>
        </div>
        <div className={"btn-group pull-right " + (assetListPro.get('isEdit') ? 'hidden' : '')}>
            <button className="btn btn-primary" onClick={() => assetList('complete')}><FormattedMessage id='button.finish'/>
            </button>
        </div>
    </div>
}

export default RenderAssetLibTop;