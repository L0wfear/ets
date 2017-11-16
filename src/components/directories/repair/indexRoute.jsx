import React from 'react';
import { Route } from 'react-router';

import directories from './index.js';

const repairRoutes = (props) => {
  const { requireAuth } = props;
  const routes = (
    <div>
      {/* НСИ - Реестры и справочники - Планирование работ по техническому содержание объектов */}
      <Route path="contractor" component={directories.contractor} onEnter={requireAuth} />
      <Route path="state-program" component={directories.stateProgram} onEnter={requireAuth} />
      <Route path="object-property" component={directories.objectProperty} onEnter={requireAuth} />
    </div>
  );

  return routes;
};

repairRoutes.propTypes = {
  requireAuth: React.PropTypes.func,
};


export default repairRoutes;
