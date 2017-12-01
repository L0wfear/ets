import React from 'react';
import { Route } from 'react-router-dom';

import directories from './index.js';

const repairRoutes = (props) => [
  <Route path="/contractor" component={directories.contractor} />,
  <Route path="/state-program" component={directories.stateProgram} />,
  <Route path="/object-property" component={directories.objectProperty} />,
];

export default repairRoutes;
