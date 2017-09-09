/**
 * 
 * @param {The stateModel's name that you expectd } modelName 
 */
export const sysInitStateModel = modelName => {
    let initModelName = modelName ? modelName : 'defaultName';
    return {
        //modelName: initModelName,
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: "",
        options: []
    }
}