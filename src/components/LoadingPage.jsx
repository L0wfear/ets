import React from 'react';
import Preloader from './ui/Preloader.jsx';

export default ({ loaded }) =>
  <Preloader type="mainpage" visible={loaded} />;
