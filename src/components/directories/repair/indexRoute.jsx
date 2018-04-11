import React from 'react';
import { Route } from 'react-router';

import directories from './index.js';

const repairRoutes = ({ requireAuth }) => (
  <div>
    <Route path="/contractor" component={directories.Contractor} onEnter={requireAuth} />,
    <Route path="/object-property" component={directories.ObjectProperty} onEnter={requireAuth} />,
    <Route path="/state-program" component={directories.StateProgram} onEnter={requireAuth} />,
  </div>
);

repairRoutes.propTypes = {
  requireAuth: React.PropTypes.func,
};

export default repairRoutes;
