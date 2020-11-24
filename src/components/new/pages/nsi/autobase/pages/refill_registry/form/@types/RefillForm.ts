import { Refill } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/@types';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsRefill = {
  refillList: IStateAutobase['refillList'];
};
export type OwnRefillProps = WithFormRegistrySearchAddProps<Refill>;

export type PropsRefillWithForm = (
  StatePropsRefill
  & OwnRefillProps
  & WithSearchProps
);

export type PropsRefill = OutputWithFormProps<
  PropsRefillWithForm,
  Refill,
  [ Refill ],
  any
>;
