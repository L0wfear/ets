import { ConfigParentData, ConfigPageDataOrDivider } from 'components/@next/@types/config_data';

const getAllChildrenPermissionListToArr = (chidrenArr: Array<ConfigParentData | ConfigPageDataOrDivider>) =>
  chidrenArr.reduce((newObj, child) => {
    if ('children' in child) {
      const {
        permissionsArr: permissionsArrChild,
        childrenPath: childrenPathChild,
      } = getAllChildrenPermissionListToArr(Object.values(child.children));
      newObj.permissionsArr.push(...permissionsArrChild);
      newObj.childrenPath.push(...childrenPathChild);
    } else if (!('divider' in child) && !('hiddenNav' in child)) {
      if (child.path) {
        newObj.childrenPath.push(child.path);
      }
      newObj.permissionsArr.push(child.permissions);
    }

    return newObj;
  }, { permissionsArr: [], childrenPath: [] });

export const getChildrenData = (children: ConfigParentData['children']): Pick<ConfigParentData, 'permissions' | 'childrenPath'> => {
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
