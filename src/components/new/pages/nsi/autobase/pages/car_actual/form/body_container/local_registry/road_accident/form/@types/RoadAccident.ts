import {
  RoadAccident,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../../../../../@types/CarForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsRoadAccidentFormLazy = {
  element: RoadAccident | null;
  onFormHide: OnFormHideType;
  selectedCarData?: CarWrap;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type OwnRoadAccidentProps = {
  element: RoadAccident | null;
  handleHide: OnFormHideType;
  selectedCarData?: CarWrap;

  page: string;
  path?: string;
};

export type PropsRoadAccidentWithForm = (
  & OwnRoadAccidentProps
);

export type PropsRoadAccident = OutputWithFormProps<
  PropsRoadAccidentWithForm,
  RoadAccident,
  [RoadAccident],
  any
>;
