import * as React from 'react';
import { connect } from 'react-redux';
import { selectors } from 'redux-main/_middleware/etsLoading';

import {
  DivNone,
} from 'global-styled/global-styled';

import Preloader from 'components/ui/new/preloader/Preloader';

type TypeConfig = {
  typePreloader?: 'mainpage' | 'graph' | 'field' | 'lazy' | void;
  page?: string;
  path?: string;
};

const withPreloader = (cofing: TypeConfig) => (Component) => (
  connect(
    (state, { page, path }) => ({
      isLoading: selectors.getLoadingCount(state.etsLoading, cofing.page || page, cofing.path || path)
    }),
  )( class PreloaderWrap extends React.Component<any, any> {
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
  })
)

export default withPreloader;
