import { TachographMetrologicalVerification } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/@types';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { WithTachographOptionsComponentProps } from '../../../tachograph_periodic_verification/form/hoc/withTachographOptions';

export type StatePropsTachographMetrologicalVerification = {
  tachographList: Array<any>;
};
export type OwnTachographMetrologicalVerificationProps = WithFormRegistrySearchAddProps<TachographMetrologicalVerification>;

export type PropsTachographMetrologicalVerificationWithForm = (
  StatePropsTachographMetrologicalVerification
  & OwnTachographMetrologicalVerificationProps
  & WithSearchProps
  & WithTachographOptionsComponentProps
);

export type PropsTachographMetrologicalVerification = OutputWithFormProps<
  PropsTachographMetrologicalVerificationWithForm,
  TachographMetrologicalVerification,
  [ TachographMetrologicalVerification ],
  any
>;
