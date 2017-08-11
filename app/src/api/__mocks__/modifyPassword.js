const modifyPassword = ({oldPw: oldPassword, newPw: newPassword}, successFun, errFun) => {
    if(oldPassword!==newPassword) successFun();
    else errFun();
}

export {modifyPassword};