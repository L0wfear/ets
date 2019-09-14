import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsDangerZoneFormWithForm = WithFormRegistrySearchAddProps<DangerZone>;

export type PropsDangerZoneForm = OutputWithFormProps<
  PropsDangerZoneFormWithForm,
  DangerZone,
  [ DangerZone ],
  any
>;
