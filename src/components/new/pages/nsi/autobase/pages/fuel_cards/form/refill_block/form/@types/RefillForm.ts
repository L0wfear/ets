import { Refill } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/@types';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { WithFormRegistrySearchAddPropsWithoutWithSerach } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsRefill = {
  refillList: IStateAutobase['refillList'];
};
export type OwnRefillProps = WithFormRegistrySearchAddPropsWithoutWithSerach<Refill>;

export type PropsRefillWithForm = (
  StatePropsRefill
  & OwnRefillProps
);

export type PropsRefill = OutputWithFormProps<
  PropsRefillWithForm,
  Refill,
  [ Refill ],
  any
>;
