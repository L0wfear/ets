import { RouteType } from 'redux-main/trash-actions/route/@types/promise.h';

export type PropsRouteInfoForm = {
  route: RouteType;
  title: string;
  onHide: () => any;
  mapKey: string;
};

export type PropsRouteInfoFormWrap = PropsRouteInfoForm & {
  showForm: boolean;
};
