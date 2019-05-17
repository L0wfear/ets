import * as React from 'react';
import { Row } from 'react-bootstrap';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import SwitchFields from './fields_in_row/fields/SwitchFields';

type FieldsRowsProps = {
  formDataKey: string;
};

const FieldsRows: React.FC<FieldsRowsProps> = React.memo(
  (props) => {
    const fields = useForm.useFormDataSchemaBodyFields<any>(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          <React.Fragment>
            {
              fields.map((fieldDataRow, indexRow) => (
                <Row key={indexRow + 1}>
                  {
                    fieldDataRow.map((fieldData) => (
                      <SwitchFields key={fieldData.key} fieldData={fieldData} formDataKey={props.formDataKey} />
                    ))
                  }
                </Row>
              ))
            }
          </React.Fragment>
        );
      },
      [fields, props],
    );
  },
);

export default FieldsRows;
