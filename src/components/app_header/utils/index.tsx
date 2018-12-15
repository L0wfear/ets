import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { isArray } from 'util';
import connectToStores from 'flummox/connect';
import { DivNone } from 'global-styled/global-styled';

export const withRouterMatchUrl: any = (Component) => (
  withRouter(
    ({ match, history, location, ...props }) => {
      return (
        <Component
          {...props}
          matchUrl={match.url}
        />
      );
    },
  )
);

export const isActivemenu = (url, path, childrenPath) => {
  const pathArr = ['--'];

  if (path) {
    pathArr.push(path);
  }
  if (isArray(childrenPath)) {
    pathArr.push(...childrenPath);
  }

  return url.match(`^${pathArr.join('|')}`);
};

export const checkShow = (props) => {
  let isShow = false;

  if (props.data.hiddenNav) {
    isShow = false;
  } else {
    const {
      data,
      data: { permissions },
    } = props;
    if (data.alwaysShow || data.divider) {
      isShow = true;
    } else if (!data.alwaysShow && permissions) {
      const { userPermissions } = props;
      const { list } = permissions;
      if (Array.isArray(list)) {
        isShow = list.some((permission) => permission === true || userPermissions.includes(permission));
      } else {
        isShow = list === true || userPermissions.includes(list);
      }
    }

    if (props.data.checkHidden) {
      isShow = props.data.checkHidden(isShow, props);
    }
  }

  return isShow;
};

export const showHeaderMenu = (Component) => (
  connectToStores(
    (props) => (
      checkShow(props)
      ? (
        <Component {...props} />
      )
      : (
        <DivNone />
      )
    ), ['session'])
);
