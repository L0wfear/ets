/**
 * Только нормальные экшены
 */
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
// import companyStructureActions from 'redux-main/reducers/modules/company_structure/actions';
// import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';
// import missionsActions from 'redux-main/reducers/modules/missions/actions';
// import orderActions from 'redux-main/reducers/modules/order/action-order';
// import routesActions from 'redux-main/reducers/modules/routes/actions';
// import sessionActions from 'redux-main/reducers/modules/session/actions-session';

const allActions = {
  autobaseActions,
  geoobjectActions,
};

export default allActions;
