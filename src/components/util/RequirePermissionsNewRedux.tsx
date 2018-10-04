import * as React from 'react';
import { connect } from 'react-redux';

import {
  DivNone,
} from 'global-styled/global-styled';

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
    null,
  )
  (({ permissions, dispatch, ...props }) => {
    const isPermitter = checkOnIsPermitter(config, props, permissions);
    const newProps = { ...props };

    if (config.withIsPermittedProps) {
      newProps.isPermitter = isPermitter;
    }

    return (

      config.withIsPermittedProps || isPermitter ?
      (
        <Component { ...newProps } />
      )
      :
      (
        <DivNone />
      )
    )
  })
);

export default withRequirePermissionsNew;

