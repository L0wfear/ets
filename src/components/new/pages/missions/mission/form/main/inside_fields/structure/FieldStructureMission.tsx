
import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import {
  getSessionStructuresOptions,
  getSessionStructuresParams,
} from 'redux-main/reducers/modules/session/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type Props = {
  disabled: boolean;

  formDataKey: FormKeys & 'mission';
  MISSION_IS_ORDER_SOURCE: boolean;
};

const FieldStructureMission: React.FC<Props> = React.memo(
  (props) => {
    const { page } = useForm.useFormDataMeta(props.formDataKey);
    const STRUCTURES = etsUseSelector((state) => getSessionStructuresOptions(state));
    const SessionStructuresParams = etsUseSelector((state) => getSessionStructuresParams(state));
    const structure_id = useForm.useFormDataFormStatePickValue<Mission, Mission['structure_id']>(props.formDataKey, 'structure_id');
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const error = useForm.useFormDataFormErrorsPickValue<Mission, string>(props.formDataKey, 'structure_id');

    const handleChangeWrap = React.useCallback(
      (valueNew, option) => {
        if (valueNew !== structure_id) {

          const changeObjDefault = {
            structure_id: valueNew,
            structure_name: get(option, 'label', null),
            car_gov_numbers: [],
            car_ids: [],
            car_type_ids: [],
            car_model_names: [],
            car_special_model_names: [],
            car_type_names: [], 

            route_id: null,
            route_name: '',
            route_type: null,
            object_type_id: null,
            object_type_name: '',

            consumable_materials: [],
          };

          const changeObj = props.MISSION_IS_ORDER_SOURCE
            ? changeObjDefault
            : {
              ...changeObjDefault,
              technical_operation_id: null,
              technical_operation_name: '',
              municipal_facility_id: null,
              municipal_facility_name: '',
            };

          handleChange({
            ...changeObj,
          });
        }
      },
      [handleChange, structure_id],
    );

    return (
      <ExtField
        type="select"
        id="structure_id"
        modalKey={page}
        label="Подразделение"
        disabled={SessionStructuresParams.STRUCTURE_FIELD_READONLY || props.disabled}
        clearable={SessionStructuresParams.STRUCTURE_FIELD_DELETABLE}
        options={STRUCTURES}
        placeholder="Не выбрано"
        emptyValue={null}
        value={structure_id}
        error={error}
        onChange={handleChangeWrap}
      />
    );
  },
);

export default FieldStructureMission;
