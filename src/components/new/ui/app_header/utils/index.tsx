import * as React from 'react';
import { isArray } from 'util';

import { getSessionState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';

export const isActivemenu = (url: string, path: string | null | undefined, childrenPath: Array<string> | null | undefined) => {
  const pathArr = [];

  if (path) {
    pathArr.push(path);
  }
  if (isArray(childrenPath)) {
    pathArr.push(...childrenPath);
  }

  return pathArr.some((pathData) => !pathData.localeCompare(url) && pathData.length === url.length);
};

type CheckShowFunc = (
  data: {
    hiddenNav?: boolean;
    divider?: boolean;
    checkHidden?: (isShow: boolean, userData: InitialStateSession['userData']) => boolean;
    permissions: { list: Parameters<typeof validatePermissions>[0]; };
  },
  userData: InitialStateSession['userData'],
) => boolean;

export const checkShow: CheckShowFunc = (data, userData) => {
  if (data.divider) {
    return true;
  }
  if (data.hiddenNav) {
    return false;
  }

  let isShow = false;
  if (data.permissions) {
    isShow = validatePermissions(data.permissions.list, userData.permissionsSet);
  }

  if (data.checkHidden) {
    isShow = data.checkHidden(isShow, userData);
  }

  return isShow;
};

export const showHeaderMenu = <OwnProps extends any>(Component: React.ComponentType<OwnProps>) => {
  const ShowHeaderMenuContainer: React.FC<OwnProps> = React.memo(
    (props) => {
      const userData = etsUseSelector(
        (state) => getSessionState(state).userData,
      );

      return Boolean(checkShow(props.data, userData)) && (
        <Component {...props} />
      );
    },
  );

  return ShowHeaderMenuContainer;
};
