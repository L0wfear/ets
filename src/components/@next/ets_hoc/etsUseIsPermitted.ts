import * as React from 'react';

import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';

export const etsUseIsPermitted = (permissions: string | Array<string | boolean> | boolean) => {
  const permissionsSet = etsUseSelector((state) => getSessionState(state).userData.permissionsSet);

  return React.useMemo(
    () => validatePermissions(permissions, permissionsSet),
    [permissions, permissionsSet],
  );
};
