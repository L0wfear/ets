import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { isArray } from 'util';
import { DivNone } from 'global-styled/global-styled';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';

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

export const isActivemenu = (url: string, path: string | null | undefined, childrenPath: string[] | null | undefined) => {
  const pathArr = ['--'];

  if (path) {
    pathArr.push(path);
  }
  if (isArray(childrenPath)) {
    pathArr.push(...childrenPath);
  }

  return pathArr.some((pathData) => !pathData.localeCompare(`/${url.split('/')[1]}`));
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
      const { permissionsSet } = props;
      const { list } = permissions;
      if (Array.isArray(list)) {
        isShow = list.some((permission) => permission === true || permissionsSet.has(permission));
      } else {
        isShow = list === true || permissionsSet.has(list);
      }
    }

    if (props.data.checkHidden) {
      isShow = props.data.checkHidden(isShow, props);
    }
  }

  return isShow;
};

export const showHeaderMenu = (Component) => (
  connect<any, any, any, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
      permissionsSet: getSessionState(state).userData.permissionsSet,
    }),
  )(
    (props) => (
      checkShow(props)
      ? (
        <Component {...props} />
      )
      : (
        <DivNone />
      )
    ),
  )
);
