import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

export type PropsColumnAssignmentFormLazy = {
  showForm: boolean;
} & PropsColumnAssignmentForm;

export type PropsColumnAssignmentForm = {
  assign_to_waybill: Array<string>;
  car_ids: Mission['car_ids'];
  handleChangeAssignToWaybill: (assign_to_waybill: Array<string>) => void;
  hideColumnAssignment: () => void;
  handleSubmit: () => Promise<Mission | void>;

  page: string;
  path: string;
};
