import { Penalty } from 'redux-main/reducers/modules/autobase/actions_by_type/penalties/@types';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsPenalty = {
  penaltyList: IStateAutobase['penaltyList'];
};
export type OwnPenaltyProps = WithFormRegistrySearchAddProps<Penalty>;

export type PropsPenaltyWithForm = (
  StatePropsPenalty
  & OwnPenaltyProps
  & WithSearchProps
);

export type PropsPenalty = OutputWithFormProps<
  PropsPenaltyWithForm,
  Penalty,
  [ Penalty ],
  any
>;
