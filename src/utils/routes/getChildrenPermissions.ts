const getAllChildrenPermissionListToArr = chidrenArr =>
  chidrenArr.reduce((newArr, child) => {
    if (child.children) {
      newArr.push(...getAllChildrenPermissionListToArr(Object.values(child.children)));
    } else if (!child.divider && !child.hiddenNav) {
      if (child.alwaysShow) {
        newArr.push({ list: [true] });
      } else {
        newArr.push(child.permissions);
      }
    }

    return newArr;
  }, []);

export const getChildrenPermissions = children => {
  const permissionsArr = getAllChildrenPermissionListToArr(Object.values(children));
  const permissionsKeys = permissionsArr.reduce((keysArr, oneComponent) => {
    Object.keys(oneComponent).forEach(key => {
      if(!keysArr.includes(key)) {
        keysArr.push(key)
      }
    });
  
    return keysArr;
  }, []);

  return permissionsArr.reduce((permData, rowP) => {
    permissionsKeys.forEach(key => {
      if(Array.isArray(rowP[key])) {
        permData[key].push(...rowP[key]);
      } else {
        permData[key].push(rowP[key])
      }
    });
  
    return permData;
  }, permissionsKeys.reduce((newData, key) => ({ ...newData, [key]: [] }), {}))
  

}
