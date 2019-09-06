import * as React from 'react';
import { get } from 'lodash';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import useMeasureUnitOptions from 'components/new/utils/hooks/services/useOptions/useMeasureUnitOptions';
import { FieldDataMeasureUnitId } from 'components/@next/@form/@types/fields/valueOfArray';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldMeasureUnitIdProps = {
  fieldData: FieldDataMeasureUnitId;
  formDataKey: string;
};

const FieldMeasureUnitId: React.FC<FieldMeasureUnitIdProps> = React.memo(
  (props) => {
    const {
      fieldData: { title, clearable, key },
    } = props;

    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const formState = useForm.useFormDataFormState<any>(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors<any>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);

    const {
      isLoading,
      options,
    } = useMeasureUnitOptions();

    const handleChangeWrap = React.useCallback(
      (value, option) => {
        handleChange({
          measure_unit_id: value,
          measure_unit_name: get(option, 'rowData.name', null),
        });
      },
      [key, handleChange],
    );

    return (
      <EtsBootstrap.Col md={props.fieldData.md || 12}>
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
      </EtsBootstrap.Col>
    );
  },
);

export default FieldMeasureUnitId;
