import * as React from 'react';
import { get } from 'lodash';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/useFormData';
import useMeasureUnitOptions from 'components/new/utils/hooks/services/useOptions/useMeasureUnitOptions';

type FieldMeasureUnitIdProps = {
  fieldData: any;
  formDataKey: string;
};

const FieldMeasureUnitId: React.FC<FieldMeasureUnitIdProps> = React.memo(
  (props) => {
    const { fieldData: { key, title, clearable } } = props;

    const page = useForm.useFormDataSchemaPage(props.formDataKey);
    const path = useForm.useFormDataSchemaPath(props.formDataKey);
    const formState = useForm.useFormDataFormState(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted(props.formDataKey);

    const options = useMeasureUnitOptions(page, path);

    const handleChangeWrap = React.useCallback(
      (event) => {
        handleChange({
          [key]: get(event, 'target.value', event),
        });
      },
      [key, handleChange],
    );

    return (
      <ExtField
        id={`${path}_${key}`}
        type="select"
        clearable={clearable}
        label={title}
        value={formState[key]}
        error={formErrors[key]}
        options={options}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldMeasureUnitId;
