import * as React from 'react';
import { get } from 'lodash';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/useFormData';
import useMeasureUnitOptions from 'components/new/utils/hooks/services/useOptions/useMeasureUnitOptions';

type FieldMeasureUnitIdProps = {
  fieldData: any;
  fieldDataKey: string;
  formDataKey: string;
};

const FieldMeasureUnitId: React.FC<FieldMeasureUnitIdProps> = React.memo(
  (props) => {
    const {
      fieldDataKey: key,
      fieldData: { title, clearable },
    } = props;

    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const formState = useForm.useFormDataFormState<any>(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors<any>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);

    const {
      isLoading,
      options,
    } = useMeasureUnitOptions('', '');

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ [key]: value });
      },
      [key, handleChange],
    );

    return React.useMemo(
      () => (
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

          etsIsLoading={isLoading}
        />
      ),
      [path, key, clearable, title, formState[key], formErrors[key], options, handleChangeWrap, isPermitted],
    );
  },
);

export default FieldMeasureUnitId;
