import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

export type StateFieldForColumnMission = {
};

export type StatePropsFieldForColumnMission = {
};
export type DispatchPropsFieldForColumnMission = {
};

export type OwnPropsFieldForColumnMission = {
  value: Mission['for_column'];
  error: string;
  disabled: boolean;
  onChange: (obj: { [key: string]: any }) => any;

  page: string;
  path: string;
};

export type PropsFieldForColumnMission = (
  StatePropsFieldForColumnMission
  & DispatchPropsFieldForColumnMission
  & OwnPropsFieldForColumnMission
);
