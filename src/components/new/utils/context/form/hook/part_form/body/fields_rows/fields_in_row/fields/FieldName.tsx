import * as React from 'react';
import { get } from 'lodash';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/useFormData';

type FieldNameProps = {
  fieldData: any;
  formDataKey: string;
};

const FieldName: React.FC<FieldNameProps> = React.memo(
  (props) => {
    const { fieldData: { key, title } } = props;
    const path = useForm.useFormDataSchemaPath(props.formDataKey);
    const formState = useForm.useFormDataFormState(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        handleChange({
          [key]: get(event, 'target.value', event),
        });
      },
      [key, handleChange],
    );

    return React.useMemo(
      () => (
        <ExtField
          id={`${path}_${key}`}
          type="string"
          label={title}
          value={formState[key]}
          error={formErrors[key]}
          onChange={handleChangeWrap}
          disabled={!isPermitted}
        />
      ),
      [path, key, title, formState[key], formErrors[key], handleChangeWrap, isPermitted],
    );
  },
);

export default FieldName;
