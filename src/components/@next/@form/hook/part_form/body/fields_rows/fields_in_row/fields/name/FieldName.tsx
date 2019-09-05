import * as React from 'react';
import { get } from 'lodash';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { FieldDataName } from 'components/@next/@form/@types/fields/string';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldNameProps = {
  fieldData: FieldDataName;
  formDataKey: string;
};

const FieldName: React.FC<FieldNameProps> = React.memo(
  (props) => {
    const {
      fieldData: { key, title },
    } = props;
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const formState = useForm.useFormDataFormState<any>(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors<any>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ [key]: value || null });
      },
      [key, handleChange],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.fieldData.md || 12}>
          <ExtField
            id={`${path}_${key}`}
            type="string"
            label={title}
            value={formState[key]}
            error={formErrors[key]}
            onChange={handleChangeWrap}
            disabled={!isPermitted}
          />
        </EtsBootstrap.Col>
      ),
      [props, path, key, title, formState[key], formErrors[key], handleChangeWrap, isPermitted],
    );
  },
);

export default FieldName;
