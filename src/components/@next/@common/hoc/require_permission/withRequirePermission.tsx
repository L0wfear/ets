import * as React from 'react';

import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';

type TypeConfig = {
  withIsPermittedProps?: boolean;                                           // true даёт isPermitted в пропсах оборачиваемого компонента
  permissions?: Parameters<typeof validatePermissions>[0];                   // разрешения для проверки | можно прокинуть как пропсы
  every?: boolean;                                                          // все ли разрешения должы быть у пользователя?
  byEntity?: boolean;                                                       // даёт пермишен для проверки `${entity}.${type}`
  type?: string;                                                            // смотри выше
};

export type WithRequirePermissionAddProps = {
  isPermitted: boolean;
};

export type WithRequirePermissionProps = {
  entity?: string;
  permissions?: string | Array<string> | boolean;
};

const makePermissionOnCheck = (config: TypeConfig, props: WithRequirePermissionProps) => {
  if (config.byEntity) {
    return `${props.entity}.${config.type}`;
  }

  return config.permissions || props.permissions || true;
};

export const withRequirePermission = <PropsOwn extends WithRequirePermissionProps>(config: TypeConfig = {}) => (
  (Component: React.ComponentType<PropsOwn & WithRequirePermissionAddProps>): React.FC<PropsOwn> => React.memo(
    (props) => {
      const permissionOnCheck = makePermissionOnCheck(config, props);
      const isPermitted = etsUseIsPermitted(permissionOnCheck);

      return Boolean(config.withIsPermittedProps || isPermitted) && (
        <Component {...props} isPermitted={isPermitted} />
      );
    },
  )
);
