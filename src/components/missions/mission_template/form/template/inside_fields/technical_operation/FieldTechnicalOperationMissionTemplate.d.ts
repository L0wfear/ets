import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
export type StateFieldTechnicalOperationMissionTemplate = {
};

export type StatePropsFieldTechnicalOperationMissionTemplate = {
  technicalOperationRegistryForMissionList: IStateSomeUniq['technicalOperationRegistryForMissionList'];
};
export type DispatchPropsFieldTechnicalOperationMissionTemplate = {
  actionGetAndSetInStoreTechnicalOperationRegistryForMission: () => Promise<any>;
};

export type OwnPropsFieldTechnicalOperationMissionTemplate = {
  value: number | void;
  name: string | void;
  disabled: boolean;
  error: string | void;
  onChange: (obj: { [key: string]: any }) => any;
  page: string;
  path: string;
};

export type PropsFieldTechnicalOperationMissionTemplate = (
  StatePropsFieldTechnicalOperationMissionTemplate
  & DispatchPropsFieldTechnicalOperationMissionTemplate
  & OwnPropsFieldTechnicalOperationMissionTemplate
);
