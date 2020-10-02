import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsTachograph = {
  TachographPeriodicVerificationList: IStateAutobase['tachographPeriodicVerificationList'];
};
export type OwnTachographProps = WithFormRegistrySearchAddProps<Tachograph> & {
  actionGetTachographsList: any;
  actionGetTachographVerificationReasonList: any;
};

export type PropsTachographWithForm = StatePropsTachograph &
  OwnTachographProps &
  WithSearchProps;

export type PropsTachograph = OutputWithFormProps<
  PropsTachographWithForm,
  Tachograph,
  [Tachograph],
  any
>;
