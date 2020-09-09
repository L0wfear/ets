import {
  IReactSelectOption,
} from 'components/old/ui/@types/ReactSelect.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { DefaultInputTypes } from './default-input/DefaultInput.h';
import { IStateMonitorPage } from 'components/old/monitor/redux-main/models/monitor-page';

export type PropsCarFilterByText = {
  active: boolean;
  isOkrug: boolean;
  company_id: InitialStateSession['userData']['company_id'];
  carActualGpsNumberIndex: any;
  geoobjectsFilter: string;
  carFilters: IStateMonitorPage['filters']['data'];
};

export type StateCarFilterByText = {
  hidden: boolean;
  carActualGpsNumberIndex: Record<string, Car>;
  carFilterMultyGpsCodeOptions: Array<IReactSelectOption>;
  carFilterMultyTypeOptions: Array<IReactSelectOption>;
  carFilterMultyTechConditionOptions: Array<IReactSelectOption>;
  carFilterMultyModelOptions: Array<IReactSelectOption>;
  carFilterMultyStructureOptions: Array<IReactSelectOption>;
  carFilterMultyOwnerOptions: Array<IReactSelectOption>;
  carFilterMultyOkrugOptions: Array<IReactSelectOption>;
  levelSensorsOptions: Array<IReactSelectOption>;
  carFilterMultyDriversOptions: Array<IReactSelectOption>;
  filterFields: Array<{key: string; type: DefaultInputTypes;}>;
};

export type DefOneAnsData = {
  obj: {[id: string]: string;};
  arr: Array<IReactSelectOption>;
};

export type CheckByIdAndNameFunc = (
  store: DefOneAnsData,
  id: number | void,
  name: string | void,
) => DefOneAnsData;
