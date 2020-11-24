import { TachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import { TachographList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { getReasonList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair_reason_list/selectors';
import { WithTachographOptionsComponentProps } from '../../../tachograph_periodic_verification/form/hoc/withTachographOptions';

export type StatePropsTachographRepair = {
  tachographRepairReasonList: ReturnType<typeof getReasonList>;
  tachographList: Array<TachographList>;
};
export type OwnTachographRepairProps = WithFormRegistrySearchAddProps<TachographRepair>;

export type PropsTachographRepairWithForm = (
  StatePropsTachographRepair
  & OwnTachographRepairProps
  & WithSearchProps
  & WithTachographOptionsComponentProps
);

export type PropsTachographRepair = OutputWithFormProps<
  PropsTachographRepairWithForm,
  TachographRepair,
  [ TachographRepair ],
  any
>;
