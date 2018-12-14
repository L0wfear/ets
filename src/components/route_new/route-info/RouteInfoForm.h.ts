import { Route } from 'redux-main/reducers/modules/routes/@types/routes.h';

export type PropsRouteInfoForm = {
  route: Route;
  title: string;
  onHide: () => any;
  mapKey: string;
};

export type PropsRouteInfoFormWrap = PropsRouteInfoForm & {
  showForm: boolean;
};
