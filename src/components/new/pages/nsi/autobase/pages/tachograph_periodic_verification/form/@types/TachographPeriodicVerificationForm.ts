import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { HandleThunkActionCreator } from 'react-redux';
import { actionGetTachographsList, actionGetTachographVerificationReasonList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/actions';

export type StatePropsTachograph = {};
export type OwnTachographProps = WithFormRegistrySearchAddProps<Tachograph> & {
  actionGetTachographsList: HandleThunkActionCreator<typeof actionGetTachographsList>;
  actionGetTachographVerificationReasonList: HandleThunkActionCreator<typeof actionGetTachographVerificationReasonList>;
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
