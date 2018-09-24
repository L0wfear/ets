import * as React from 'react';
import { connect } from 'react-redux';

type TypeConfig = {
  withIsPermittedProps?: boolean;
  permissions?: string | string[];
  every?: boolean;
}

const checkOnIsPermitter = (config, props, permissions) => {
  let permissionsOnCheck = config.permissions || props.permissions;
  permissionsOnCheck = Array.isArray(permissionsOnCheck) ? permissionsOnCheck : [permissionsOnCheck];

  if (config.every) {
    return permissionsOnCheck.some(permission => !permissions.includes(permission));
  }

  return permissionsOnCheck.some(permission => permissions.includes(permission));
}

const withRequirePermissionsNew = (config: TypeConfig = {}) => Component => (
  connect(
    state => ({
      permissions: state.session.userData.permissions,
    }),
  )
  (({ permissions, ...props }) => {
    const isPermitter = checkOnIsPermitter(config, props, permissions);

    return (
      config.withIsPermittedProps || isPermitter ?
      (
        <Component
          {...props}
          isPermitter={config.withIsPermittedProps ? isPermitter : undefined}
        />
      )
      :
      (
        <div className="none"></div>
      )
    )
  })
);

export default withRequirePermissionsNew;

