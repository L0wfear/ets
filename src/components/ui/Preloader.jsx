import React, { PropTypes } from 'react';
import preloaderGif from '../../assets/images/infinity.gif';

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
    default:
      return <div />;
  }
}

Preloader.propTypes = {
  style: PropTypes.object,
  type: PropTypes.string,
};
