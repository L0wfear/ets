import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import {
  DivNone,
} from 'global-styled/global-styled';
import { ReduxState } from 'redux-main/@types/state';
import { isArray } from 'util';

type TypeConfig = {
  withIsPermittedProps?: boolean;
  permissions?: string | string[];
  every?: boolean;
  byEntity?: boolean;
  type?: string;
  permissionName?: string;
};

const makePermissionOnCheck = (config, props) => {
  if (config.byEntity) {
    return [`${props.entity}.${config.type}`];
  }

  const permissionsOnCheck = config.permissions || props.permissions;

  return isArray(permissionsOnCheck) ? permissionsOnCheck : [permissionsOnCheck];
};

const checkOnisPermitted = (config, props, permissionsSet) => {
  const permissionsOnCheck = makePermissionOnCheck(config, props);

  if (config.every) {
    return permissionsOnCheck.some((permission) => !permissionsSet.has(permission));
  }

  return permissionsOnCheck.some((permission) => permissionsSet.has(permission));
};

type StateProps = {
  permissionsSet: ReduxState['session']['userData']['permissionsSet'];
};

type OwnerProps<P> = P & {
  [key: string]: any;
};

type PropsRequirePermissions<P> = (
  StateProps &
  OwnerProps<P>
);

const withRequirePermissionsNew = <P extends {}, O = {}>(config: TypeConfig = {}) => (Component: React.ClassType<P & O, any, any>) => (
  connect<StateProps, {}, OwnerProps<P>, ReduxState>(
    (state) => ({
      permissionsSet: state.session.userData.permissionsSet,
    }),
  )
  (
    class RequirePermissions extends React.Component<PropsRequirePermissions<P>, {}> {
      render() {
        const { permissionsSet, dispatch, ...props } = this.props;

        const isPermitted = checkOnisPermitted(config, props, permissionsSet);
        const newProps = { ...props };

        if (config.withIsPermittedProps) {
          const name = get(config, 'permissionName', 'isPermitted');
          newProps[name] = isPermitted;
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
    },
  )
);

export default withRequirePermissionsNew;
