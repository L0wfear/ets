import * as React from 'react';
import {
  MainPageLoader,
  CssloadLoader,
} from 'components/old/ui/new/preloader/styled/styled';

export type Props = {
  typePreloader: 'mainpage' | 'field' | 'lazy';
};

const preloaderFieldGif = require('assets/images/preloader-field.gif');

const PreloadNew: React.FC<Props> = React.memo(
  (props) => {
    const {
      typePreloader,
    } = props;

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
  },
);

export default PreloadNew;
