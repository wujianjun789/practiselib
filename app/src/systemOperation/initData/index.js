/** Created By ChrisWen
 *  17/08/31
 *  These Two functions is provide initData to smartLight-smartLightPole.
 *  当点击对应的按钮进行id判断后激活对应的函数;
 */
export const sysInitData = {
    add(curType, domainList) {
        return {
            id: '',
            name: '',
            model: curType ? curType.title : "",
            modelId: curType ? curType.id : "",
            domain: domainList.value,
            domainId: domainList.options.length ? domainList.options[domainList.index].id : "",
            lng: "",
            lat: ""
        }
    },
    update(latlng, data, selectDevice) {
        return {
            id: data ? data.id : null,
            name: data ? data.name : null,
            model: data ? getModelTypesNameById(model, data.type) : "",
            modelId: data ? data.type : null,
            domain: selectDevice.domainName,
            domainId: selectDevice.domainId,
            lng: latlng.lng,
            lat: latlng.lat
        }
    }

}


