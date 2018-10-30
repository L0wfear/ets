import * as React from 'react';
import { connect } from 'react-redux';

import {
  DivNone,
} from 'global-styled/global-styled';
import { ReduxState } from 'redux-main/@types/state';

type TypeConfig = {
  withIsPermittedProps?: boolean;
  permissions?: string | string[];
  every?: boolean;
  byEntity?: boolean;
  type?: string;
};

const makePermissionOnCheck = (config, props) => {
  if (config.byEntity) {
    return [`${props.entity}.${config.type}`];
  }

  const permissionsOnCheck = config.permissions || props.permissions;

  return Array.isArray(permissionsOnCheck) ? permissionsOnCheck : [permissionsOnCheck]
};

const checkOnisPermitted = (config, props, permissions) => {
  let permissionsOnCheck = makePermissionOnCheck(config, props);

  if (config.every) {
    return permissionsOnCheck.some(permission => !permissions.includes(permission));
  }

  return permissionsOnCheck.some(permission => permissions.includes(permission));
}

type StateProps = {
  permissions: string[];
};

type OwnerProps = {
  [key: string]: any;
}

type PropsRequirePermissions = StateProps & OwnerProps;

const withRequirePermissionsNew = (config: TypeConfig = {}) => Component => (
  connect<StateProps, {}, OwnerProps, ReduxState>(
    state => ({
      permissions: state.session.userData.permissions,
    }),
  )
  (
    class RequirePermissions extends React.Component<PropsRequirePermissions, {}> {
      render() {
        const { permissions, dispatch, ...props } = this.props;

        const isPermitted = checkOnisPermitted(config, props, permissions);
        const newProps = { ...props };

        if (config.withIsPermittedProps) {
          newProps.isPermitted = isPermitted;
        }

        return (
          config.withIsPermittedProps || isPermitted ?
            (
              <Component { ...newProps } />
            )
          :
            (
              <DivNone />
            )
        );
      }
    }
  )
);
  

export default withRequirePermissionsNew;

