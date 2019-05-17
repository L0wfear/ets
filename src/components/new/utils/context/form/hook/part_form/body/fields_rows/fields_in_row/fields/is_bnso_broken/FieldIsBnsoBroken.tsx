import * as React from 'react';
import { get } from 'lodash';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import { FieldDataIsBnsoBroken } from 'components/new/utils/context/form/@types/fields/string';
import { Col } from 'react-bootstrap';

type FieldIsBnsoBrokenProps = {
  fieldData: FieldDataIsBnsoBroken;
  formDataKey: string;
};

const FieldIsBnsoBroken: React.FC<FieldIsBnsoBrokenProps> = React.memo(
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
        <Col md={props.fieldData.md || 12}>
          <ExtField
            id={`${path}_${key}`}
            type="string"
            label={title}
            value={formState[key]}
            error={formErrors[key]}
            onChange={handleChangeWrap}
            disabled={!isPermitted}
          />
        </Col>
      ),
      [props, path, key, title, formState[key], formErrors[key], handleChangeWrap, isPermitted],
    );
  },
);

export default FieldIsBnsoBroken;
