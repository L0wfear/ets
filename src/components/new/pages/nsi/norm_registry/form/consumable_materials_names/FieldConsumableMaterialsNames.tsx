import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';

type Props = {
  formDataKey: 'norm';
};

const FieldConsumableMaterialsNames: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<Norm>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<Norm, Norm['consumable_materials_names']>(props.formDataKey, 'consumable_materials_names');
    const error = useForm.useFormDataFormErrorsPickValue<Norm, string>(props.formDataKey, 'consumable_materials_names');
    const handleChange = useForm.useFormDataHandleChange<Norm>(props.formDataKey);
    const isPermitted = false; // useForm.useFormDataIsPermitted<Norm>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ consumable_materials_names: value || null });
      },
      [handleChange],
    );

    const options = React.useMemo(
      () => {
        return formStateValue.map((name) => ({
          value: name,
          label: name,
        }));
      },
      [formStateValue],
    );

    return (
      <ExtField
        id={`${meta.path}_consumable_materials_names`}
        type="select"
        multi
        hint="Расходные материалы заполняются в «НСИ -> Показатели для расчета -> Расходные материалы»"
        label="Расходные материалы"
        placeholder={null}
        value={formStateValue}
        options={options}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldConsumableMaterialsNames;
