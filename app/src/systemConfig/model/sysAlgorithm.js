/** Created By ChrisWen
 *  17/09/12
 *  This file is the algorithm that has been used in systemConfig Componet.
 */

//Return a new arrayList whether arrayB or arrayA all has these object.
export const intersection = (arrayA, arrayB) => {
  let set = new Set(arrayB.map(item => {
    return item.id;
  }));
  arrayA.map(item => {
    if (set.has(item.id) === false) {
      item.added = false;
    } else {
      item.added = true;
    }
  });
  return arrayA;
};