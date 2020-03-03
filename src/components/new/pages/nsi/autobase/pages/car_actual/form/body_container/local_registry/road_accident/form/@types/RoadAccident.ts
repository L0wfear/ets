import {
  RoadAccident,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../../../../../@types/CarForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsRoadAccidentWithForm = WithFormRegistrySearchAddProps<RoadAccident> & { selectedCarData?: CarWrap; };

export type PropsRoadAccident = OutputWithFormProps<
  PropsRoadAccidentWithForm,
  RoadAccident,
  [RoadAccident],
  any
>;
