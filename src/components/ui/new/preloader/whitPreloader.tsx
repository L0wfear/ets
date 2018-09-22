import * as React from 'react';
import { connect } from 'react-redux';
import { selectors } from 'redux-main/_middleware/etsLoading';

import {
  DivNone,
} from 'global-styled/global-styled';

type TypeConfig = {
  typePreloader?: 'mainpage' | 'graph' | 'field' | 'lazy'
  page?: string;
  path?: string;
};

require('components/ui/new/preloader/preloader.scss');

const preloaderGif = require('assets/images/infinity.gif');
const preloaderFieldGif = require('assets/images/preloader-field.gif');

const PreloaderComponent = ({ typePreloader }) => {
  switch (typePreloader) {
    case 'mainpage':
      return (
        <div className="gost-loading-overlay" id="loadingOverlay">
          <div className="cssload-loader" />
        </div>
      );
    case 'graph':
      return (
        <img id="preloader-graph" src={preloaderGif} alt="Идет загрузка" />
      );
    case 'field':
      return (
        <img id="preloader-field" src={preloaderFieldGif} alt="Идет загрузка" />
      );
    case 'lazy':
      return (
        <div className="gost-weak-loading-overlay">
          <img id="preloader-lazy" src={preloaderFieldGif} alt="Идет загрузка" />Загрузка...
        </div>
      );
    default:
      return <div id="preloader-custom" className="custom-preloader" />;
  }
}

const withPreloader = (cofing: TypeConfig) => (Component) => (
  connect(
    (state) => ({
      isLoading: selectors.getLoadingCount(state.etsLoading, cofing.page, cofing.path)
    }),
  )(
    ({ isLoading, dispatch, ...props }) => (
      <div className="shadow">
        {
          isLoading ?
          (
            <PreloaderComponent typePreloader={cofing.typePreloader} />
          )
          :
          (
            <DivNone />
          )
        }
        <Component {...props} />
      </div>
    ),
  )
)

export default withPreloader;
