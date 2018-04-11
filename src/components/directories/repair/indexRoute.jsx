import React from 'react';
import { Route } from 'react-router';

import directories from './index.js';

const repairRoutes = ({ requireAuth }) => [
  <Route path="/contractor" component={directories.Contractor} onEnter={requireAuth} />,
  <Route path="/object-property" component={directories.ObjectProperty} onEnter={requireAuth} />,
  <Route path="/state-program" component={directories.StateProgram} onEnter={requireAuth} />,
];

export default repairRoutes;
