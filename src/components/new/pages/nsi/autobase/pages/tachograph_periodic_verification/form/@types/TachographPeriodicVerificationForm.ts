import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsTachograph = {};
export type OwnTachographProps = WithFormRegistrySearchAddProps<Tachograph> & {
  actionGetTachographsList: any;
  actionGetTachographVerificationReasonList: any;
  actionGetAndSetInStoreTachographsList: any;
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
