import * as React from 'react';
import {
  MainPageLoader,
  CssloadLoader,
} from 'components/ui/new/preloader/styled/styled';

export type PropsPreloadNew = {
  typePreloader: 'mainpage' | 'field' | 'lazy';
};

const preloaderFieldGif = require('assets/images/preloader-field.gif');

class PreloadNew extends React.Component<PropsPreloadNew, {}> {
  render() {
    const {
      typePreloader,
    } = this.props;

    switch (typePreloader) {
      case 'mainpage':
      case 'lazy':
        return (
          <MainPageLoader id="loadingOverlay">
            <CssloadLoader />
          </MainPageLoader>
        );
      case 'field':
        return (
          <img id="preloader-field" src={preloaderFieldGif} alt="Идет загрузка" />
        );
      default:
        return <div id="preloader-custom" className="custom-preloader" />;
    }
  }
}

export default PreloadNew;
