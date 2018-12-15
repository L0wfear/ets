const getAllChildrenPermissionListToArr = (chidrenArr) =>
  chidrenArr.reduce((newObj, child) => {
    if (child.children) {
      const {
        permissionsArr: permissionsArrChild,
        childrenPath: childrenPathChild,
      } = getAllChildrenPermissionListToArr(Object.values(child.children));
      newObj.permissionsArr.push(...permissionsArrChild);
      newObj.childrenPath.push(...childrenPathChild);
    } else if (!child.divider && !child.hiddenNav) {
      if (child.path) {
        newObj.childrenPath.push(child.path);
      }
      if (child.alwaysShow) {
        newObj.permissionsArr.push({ list: [true] });
      } else {
        newObj.permissionsArr.push(child.permissions);
      }
    }

    return newObj;
  }, { permissionsArr: [], childrenPath: [] });

export const getChildrenData = (children) => {
  const { permissionsArr, childrenPath } = getAllChildrenPermissionListToArr(Object.values(children));

  const permissionsKeys = permissionsArr.reduce((keysArr, oneComponent) => {
    Object.keys(oneComponent).forEach((key) => {
      if (!keysArr.includes(key)) {
        keysArr.push(key);
      }
    });

    return keysArr;
  }, []);

  return {
    permissions: permissionsArr.reduce((permData, rowP) => {
      permissionsKeys.forEach((key) => {
        if (Array.isArray(rowP[key])) {
          permData[key].push(...rowP[key]);
        } else {
          permData[key].push(rowP[key]);
        }
      });

      return permData;
    }, permissionsKeys.reduce((newData, key) => ({ ...newData, [key]: [] }), {})),
    childrenPath,
  };
};
