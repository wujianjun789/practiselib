/** Created By ChrisWen
 * 检查预览播放项数组的各ID是否真实有效。
 * /


const previewList = [{ areaId: 1, playItemId: 10 }, { areaId: 2, playItemId: 2 }, { areaId: 3, playItemId: 3 }];
const sourcePlayItemList = [{areaId:1, playItemList:[1, 2, 3, 4, 5]}, {areaId:2, playItemList:[3, 2]}, {areaId:3, playItemList:[2, 3]}];

/*
 * @param {Array<previewItem>} previewList 
 * @param {object} sourcePlayItemList 
 */

function getPreviewListCheck(previewList, sourcePlayItemList) {
  // 检查区域是否一致，如果区域少了，删除多余的区域。
  const areaList = sourcePlayItemList.map(item => { return item.areaId; });
  const areaCheckedPreviewList = getAreaCheck(previewList, areaList);
  // 检查播放项是否一致，如果播放项不存在，改为65535
  const itemsCheckedPrevielist = getPlayItemsCheck(areaCheckedPreviewList, sourcePlayItemList);
  return itemsCheckedPrevielist;
  
}

/**
 * 检查区域是否一一匹配
 * @param {object} previewList 
 * @param {Array<Number>} sourceAreaList 
 */

function getAreaCheck(previewList, sourceAreaList) {
  const areaCheckedPreviewList = previewList.filter(item => { return sourceAreaList.indexOf(item.areaId) > -1; });
  return areaCheckedPreviewList;
}

function getPlayItemsCheck(areaCheckedPreviewList, sourcePlayItemList) {
  const itemsCheckedPrevielist = areaCheckedPreviewList.map((item) => {
    const { areaId = -1 } = item;
    for (let i = 0; i < sourcePlayItemList.length; i++) {
      if (sourcePlayItemList[i].areaId === areaId && sourcePlayItemList[i].playItemList.indexOf(item.playItemId) > -1) {
        return item;
      }
    }
    item.playItemId = 65535;
    return item;
  });
  return itemsCheckedPrevielist;
}
console.log(getPreviewListCheck(previewList, sourcePlayItemList));