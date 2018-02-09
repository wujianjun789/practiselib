/** Created By ChrisWen
 * 检查预览播放项数组的各ID是否真实有效。
 * /


// const previewList = [{ areaId: 1, playItemId: 10 }, { areaId: 2, playItemId: 2 }, { areaId: 3, playItemId: 3 }];
// const sourcePlayItemList = [{areaId:1, playItemList:[1, 2, 3, 4, 5]}, {areaId:2, playItemList:[3, 2]}, {areaId:3, playItemList:[2, 3]}];


/*
 * @param {Array<previewItem>} previewList 
 * @param {object} sourcePlayItemList 
 */

// const sourcePlayItemObj = {2:[1, 2, 3, 4], 3:[1, 2, 3, 4], 4:[]};
// const previewList = [{ areaId: 1, playItemId: 10 }, { areaId: 2, playItemId: 2 }, { areaId: 3, playItemId: 30 }];
function getPreviewListCheck(previewList, sourcePlayItemObj) {
  // 检查区域是否一致，如果区域少了，删除多余的区域。
  // const areaList = sourcePlayItemObj.map(item => { return item.areaId; });
  const areaCheckedPreviewList = getAreaCheck(previewList, sourcePlayItemObj);
  // 检查播放项是否一致，如果播放项不存在，改为65535
  const itemsCheckedPrevielist = getPlayItemsCheck(areaCheckedPreviewList, sourcePlayItemObj);
  return itemsCheckedPrevielist;
  
}

/**
 * 检查区域是否一一匹配
 * @param {object} previewList 
 * @param {Array<Number>} sourceAreaList 
 */

function getAreaCheck(previewList, sourcePlayItemObj) {
  const areaCheckedPreviewList = previewList.filter(item => { return sourcePlayItemObj[item.areaId]; });
  return areaCheckedPreviewList;
}

function getPlayItemsCheck(areaCheckedPreviewList, sourcePlayItemObj) {
  const itemsCheckedPrevielist = areaCheckedPreviewList.map((item) => {
    const { areaId = 65535 } = item;
    if (sourcePlayItemObj[areaId]) {
      const handledSourcePlayItemArray = sourcePlayItemObj[areaId].map(item => { return item.id; });
      if (handledSourcePlayItemArray.indexOf(item.playItemId) < 0) {
        item.playItemId = 65535;
      }
      return item;
    }
  });
  return itemsCheckedPrevielist;
}

export default getPreviewListCheck;
