import React, { PropTypes } from 'react';
import './preloader.scss';
import preloaderGif from '../../assets/images/infinity.gif';
import preloaderFieldGif from '../../assets/images/preloader-field.gif';

export default function Preloader({ style = {}, type = '' }) {
  switch (type) {
    case 'mainpage':
      return (
        <div className="gost-loading-overlay" id="loadingOverlay">
          <div className="cssload-loader" />
        </div>
      );
    case 'graph':
      return (
        <img id="preloader-graph" src={preloaderGif} style={style} alt="Идет загрузка" />
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

Preloader.propTypes = {
  style: PropTypes.object,
  type: PropTypes.string,
};
