import * as React from 'react';
import {
  MainPageLoader,
  CssloadLoader,
  GostWeakLoadingOverlay,
} from 'components/ui/new/preloader/styled/styled';


type PropsPreloaderComponent = {
  typePreloader: 'mainpage' | 'graph' | 'field' | 'lazy' | void;
};

const preloaderGif = require('assets/images/infinity.gif');
const preloaderFieldGif = require('assets/images/preloader-field.gif');

class PreloaderComponent extends React.Component<PropsPreloaderComponent, {}> {
  render() {
    const {
      typePreloader,
    } = this.props;

    switch (typePreloader) {
      case 'mainpage':
        return (
          <MainPageLoader id="loadingOverlay">
            <CssloadLoader />
          </MainPageLoader>
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
          <GostWeakLoadingOverlay>
            <img id="preloader-lazy" src={preloaderFieldGif} alt="Идет загрузка" />Загрузка...
          </GostWeakLoadingOverlay>
        );
      default:
        return <div id="preloader-custom" className="custom-preloader" />;
    }
  }
};

export default PreloaderComponent;
