import * as React from 'react';
import useForm from 'components/new/utils/context/form/useFormData';
import { Row } from 'react-bootstrap';
import FieldsInRow from './fields_in_row/FieldsInRow';

type FieldsRowsProps = {
  formDataKey: string;
};

const FieldsRows: React.FC<FieldsRowsProps> = React.memo(
  (props) => {
    const fields = useForm.useFormDataSchemaBodyFields(props.formDataKey);

    const fieldsRows = React.useMemo(
      () => {
        return (
          fields.map((fieldsInRow, indexRow) => (
            <Row key={indexRow + 1}>
              <FieldsInRow fieldsInRow={fieldsInRow} formDataKey={props.formDataKey} />
            </Row>
          ))
        );
      },
      [fields, props.formDataKey],
    );

    return (
      fieldsRows
    );
  },
);

export default FieldsRows;
