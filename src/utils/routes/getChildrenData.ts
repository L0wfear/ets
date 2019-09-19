import { ConfigParentData, ConfigPageDataOrDivider } from 'components/@next/@types/config_data';

const getAllChildrenPermissionListToArr = (chidrenArr: Array<ConfigParentData | ConfigPageDataOrDivider>) =>
  chidrenArr.reduce((newObj, child) => {
    if ('children' in child) {
      const {
        permissionsArr: permissionsArrChild,
        childrenPath: childrenPathChild,
        isNewRegistry: childrenIsNewRegistry,
      } = getAllChildrenPermissionListToArr(Object.values(child.children));
      newObj.permissionsArr.push(...permissionsArrChild);
      newObj.childrenPath.push(...childrenPathChild);
      newObj.isNewRegistry = newObj.isNewRegistry && childrenIsNewRegistry;
    } else if (!('divider' in child) && !('hiddenNav' in child)) {
      if (child.path) {
        newObj.childrenPath.push(child.path);
      }
      newObj.permissionsArr.push(child.permissions);
      newObj.isNewRegistry = newObj.isNewRegistry && child.isNewRegistry;
    }

    return newObj;
  }, { permissionsArr: [], childrenPath: [], isNewRegistry: true, });

export const getChildrenData = (children: ConfigParentData['children']): Pick<ConfigParentData, 'permissions' | 'childrenPath' | 'isNewRegistry'> => {
  const { permissionsArr, childrenPath, isNewRegistry } = getAllChildrenPermissionListToArr(Object.values(children));

  const permissionsKeys = permissionsArr.reduce((keysArr, oneComponent) => {
    Object.keys(oneComponent).forEach((key) => {
      if (!keysArr.includes(key)) {
        keysArr.push(key);
      }
    });

    return keysArr;
  }, []);

  return {
    isNewRegistry,
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
