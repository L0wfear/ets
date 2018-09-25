import * as React from 'react';
import * as PropTypes from 'prop-types';
import Preloader from './ui/Preloader';

export default function LoadingPage({ loaded }) {
  return <Preloader type="mainpage" visible={loaded} />;
}

LoadingPage.propTypes = {
  loaded: PropTypes.bool,
};
