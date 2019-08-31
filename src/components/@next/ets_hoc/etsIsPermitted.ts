import * as React from 'react';

import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';
import { validatePermissions } from 'components/old/util/RequirePermissionsNewRedux';

export const etsIsPermitted = (permissions: boolean | string | string[]) => {
  const permissionsSet = etsUseSelector((state) => getSessionState(state).userData.permissionsSet);

  return React.useMemo(
    () => validatePermissions(permissions, permissionsSet),
    [permissions, permissionsSet],
  );
};
