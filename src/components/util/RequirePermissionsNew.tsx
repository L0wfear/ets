import * as React from 'react';
import connectToStores from 'flummox/connect';
import { FluxContext } from 'utils/decorators';
import { DivNone } from 'global-styled/global-styled';

const checkOnTrueHidden = (config, props, context) => {
  let isHidden = true;
  const permission = config.permission || props.permission;
  const permissions = config.permissions || props.permissions;
  const ignorePermission = config.ignorePermission || props.ignorePermission;

  if (ignorePermission || (!permissions && !permission)) {
    isHidden = false;
  } else if (Array.isArray(permissions) && props.userPermissions.some((per) => permissions.includes(per))) {
    isHidden = false;
  } else if (props.userPermissions.includes(permission)) {
    isHidden = false;
  }

  return isHidden;
};

const mergeProps = (config, props: any, context) => {
  const {
    ignorePermission,
    permission,
    permissions,
    ...lessProps
  } = props;

  let mergedProps = { ...lessProps };

  Object.keys(context.flux.getStore('session').state)
    .forEach((key) =>
      delete mergedProps[key],
    );

  if (config.mergeProps) {
    mergedProps = config.mergeProps(mergedProps, context);
  }

  return mergedProps;
};

const withCheckPermission = (checkData) => (Component) =>
  connectToStores(
    FluxContext(
    (props, context) => (
      checkOnTrueHidden(checkData, props, context)
        ? (
          <DivNone />
        )
        : (
          <Component
            { ...mergeProps(checkData, props, context) }
          />
        )
    )),
    ['session'],
  );

export default withCheckPermission;
