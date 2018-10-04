import * as React from 'react';
import * as PropTypes from 'prop-types';
import Preloader from 'components/ui/new/preloader/Preloader';

export default function LoadingPage({ loaded }) {
  return <Preloader typePreloader="mainpage" visible={loaded} />;
}

LoadingPage.propTypes = {
  loaded: PropTypes.bool,
};
