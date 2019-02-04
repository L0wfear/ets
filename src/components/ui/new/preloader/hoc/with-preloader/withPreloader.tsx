import * as React from 'react';
import { connect } from 'react-redux';
import { selectors } from 'redux-main/_middleware/etsLoading';

import {
  DivNone,
} from 'global-styled/global-styled';

import Preloader from 'components/ui/new/preloader/Preloader';

import { ReduxState } from 'redux-main/@types/state';

type TypeConfig = {
  typePreloader?: 'mainpage' | 'graph' | 'field' | 'lazy' | void;
  page?: string;
  path?: string;
};

type StateProps = {
  isLoading: boolean;
};

type OwnerProps = {
  [key: string]: any;
};

type PropsPreloaderWrap = StateProps & OwnerProps;

const withPreloader = (cofing: TypeConfig) => (Component) => (
  connect<StateProps, {}, OwnerProps, ReduxState>(
    (state, { page, path }) => ({
      isLoading: selectors.getLoadingCount(state.etsLoading, cofing.page || page, cofing.path || path),
    }),
  )(
    class PreloaderWrap extends React.Component<PropsPreloaderWrap, {}> {
      render() {
        const { isLoading, dispatch, page, path, typePreloader, ...props } = this.props;

        return (
          <div className="shadow">
            {
              isLoading ?
              (
                <Preloader typePreloader={cofing.typePreloader || typePreloader} />
              )
              :
              (
                <DivNone />
              )
            }
            <Component {...props} />
          </div>
        );
      }
    },
  )
);

export default withPreloader;
