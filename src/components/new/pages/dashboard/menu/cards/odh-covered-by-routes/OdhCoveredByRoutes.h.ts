import { OdhCoveredByRoutesItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-covered-by-routes.h';

export type StatePropsOdhCoveredByRoutes = {
  items: OdhCoveredByRoutesItemsType[];
};

export type DispatchPropsOdhCoveredByRoutes = {
  setInfoData: (infoData: OdhCoveredByRoutesItemsType) => any;
};

export type OwnPropsOdhCoveredByRoutes = {};

export type PropsOdhCoveredByRoutes = (
  StatePropsOdhCoveredByRoutes
  & DispatchPropsOdhCoveredByRoutes
  & OwnPropsOdhCoveredByRoutes
);

export type StateOdhCoveredByRoutes = {
};
