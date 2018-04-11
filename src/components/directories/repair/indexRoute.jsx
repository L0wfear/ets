import React from 'react';
import { Route } from 'react-router-dom';

import directories from './index.js';

const repairRoutes = () => [
  <Route path="/contractor" component={directories.Contractor} />,
  <Route path="/object-property" component={directories.ObjectProperty} />,
  <Route path="/state-program" component={directories.StateProgram} />,
];

export default repairRoutes;
