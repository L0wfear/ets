import React, { PropTypes } from 'react';
import './preloader.scss';
import preloaderGif from '../../assets/images/infinity.gif';
import preloaderFieldGif from '../../assets/images/preloader-field.gif';

export default function Preloader({ style, type }) {
  switch (type) {
    case 'mainpage':
      return (
        <div className="cssload-loader" />
      );
    case 'graph':
      return (
        <img src={preloaderGif} style={style} alt="Идет загрузка" />
      );
    case 'field':
      return (
        <img src={preloaderFieldGif} alt="Идет загрузка" />
      );
    default:
      return <div className="custom-preloader" />;
  }
}

Preloader.propTypes = {
  style: PropTypes.object,
  type: PropTypes.string,
};
