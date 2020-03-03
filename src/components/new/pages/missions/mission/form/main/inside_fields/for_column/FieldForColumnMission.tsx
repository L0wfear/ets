
import * as React from 'react';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

type Props = {
  disabled: boolean;
  formDataKey: FormKeys & 'mission';
};

const FieldForColumnMission: React.FC<Props> = React.memo(
  (props) => {
    const { page } = useForm.useFormDataMeta(props.formDataKey);
    const for_column = useForm.useFormDataFormStatePickValue<Mission, Mission['for_column']>(props.formDataKey, 'for_column');
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      () => {
        handleChange({
          for_column: !for_column,

          technical_operation_id: null,
          technical_operation_name: '',
          municipal_facility_id: null,
          municipal_facility_name: '',
          route_id: null,
          route_name: '',
          route_type: null,
          object_type_id: null,
          object_type_name: '',

          consumable_materials: [],
        });
      },
      [handleChange, for_column],
    );

    return (
      <ExtField
        id="for_column"
        modalKey={page}
        type="select"
        label="Колонна"
        disabled={props.disabled}
        value={+for_column}
        options={YES_NO_SELECT_OPTIONS_INT}
        onChange={handleChangeWrap}
        clearable={false}
      />
    );
  },
);

export default FieldForColumnMission;
