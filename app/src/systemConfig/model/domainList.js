/**Created By ChrisWen
 * 17/09/04
 * Detaching initDomainListFunction as a DomainList model to provide same functions.
 */
export const DomainList = {
    //provide data that used to initDomain
    init(data) {
        return {
            index: 0,
            value: data.length ? data[0].name : "",
            options: data
        }
    },
    //provide data that used to selectDomain in <Select change/>
    select(event, domainList) {
        let index = event.target.selectedIndex;
        return {
            index: index,
            value: domainList.options[index].name
        }
    }
}