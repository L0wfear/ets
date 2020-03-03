import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsTire = {
  tireModelList: IStateAutobase['tireModelList'];
  tireSizeList: IStateAutobase['tireSizeList'];
  isPermitterToUpdateInitialMileage: boolean;
};
export type OwnTireProps = WithFormRegistrySearchAddProps<Tire>;

export type PropsTireWithForm = (
  StatePropsTire
  & OwnTireProps
  & WithSearchProps
);

export type PropsTire = OutputWithFormProps<
  PropsTireWithForm,
  Tire,
  [ Tire ],
  any
>;
