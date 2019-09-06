import * as React from 'react';
import { connect } from 'react-redux';

import { selectors } from 'redux-main/_middleware/etsLoading';
import PreloadNew, { PropsPreloadNew } from 'components/old/ui/new/preloader/PreloadNew';

import { ReduxState } from 'redux-main/@types/state';

type TypeConfig = {
  typePreloader?: PropsPreloadNew['typePreloader'];
  page?: string;
  path?: string;
  withPagePath?: boolean;
};

type StateProps = {
  isLoading: boolean;
};

type OwnerProps = {
  [key: string]: any;
};

type PropsPreloaderWrap = StateProps & OwnerProps;

const withPreloader = (configWithPreloader: TypeConfig) => (Component) => (
  connect<StateProps, {}, OwnerProps, ReduxState>(
    (state, { page, path }) => ({
      isLoading: selectors.getLoadingCount(state.etsLoading, configWithPreloader.page || page, configWithPreloader.path || path),
    }),
  )(
    class PreloaderWrap extends React.Component<PropsPreloaderWrap, {}> {
      render() {
        const { isLoading, dispatch, page, path, typePreloader, ...props } = this.props;

        return (
          <React.Fragment>
            {
              Boolean(isLoading) && (
                <PreloadNew typePreloader={configWithPreloader.typePreloader || typePreloader} />
              )
            }
            <Component
              {...props}
                page={configWithPreloader.withPagePath ? page : undefined}
                path={configWithPreloader.withPagePath ? path : undefined}
            />
          </React.Fragment>
        );
      }
    },
  )
);

export default withPreloader;
