import React from 'react';
import Preloader from './ui/Preloader.jsx';

export default function LoadingPage({ loaded }) {
  return <Preloader type="mainpage" visible={loaded} />;
}

LoadingPage.propTypes = {
  loaded: React.PropTypes.bool,
};
