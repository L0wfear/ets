import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import useWaybillFormData from 'components/new/utils/context/form/hoc_selectors/waybill/useWaybillForm';
import FieldWaybillStructureId from './structure/FieldWaybillStructureId';
import { FieldDataWaybillStructureAndAccompanyingPerson } from 'components/new/utils/context/form/@types/fields/waybill';

type FieldWaybillStructureAndAccompanyingPersonProps = {
  fieldData: FieldDataWaybillStructureAndAccompanyingPerson;
  formDataKey: string;
};

const ComponentsByKey: Record<ValuesOf<FieldDataWaybillStructureAndAccompanyingPerson['fields']>['key'], React.ComponentType<any>> = {
  structure_id: FieldWaybillStructureId,
};

const FieldWaybillStructureAndAccompanyingPerson: React.FC<FieldWaybillStructureAndAccompanyingPersonProps> = React.memo(
  (props) => {
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          <Col md={IS_CLOSE_OR_IS_ACTIVE ? 4 : 6}>
            <Row>
              {
                props.fieldData.fields.map(
                  (fieldData) => {
                    const ComponentName = ComponentsByKey[fieldData.key];

                    if (ComponentName) {
                      return (
                        <ComponentName
                          key={fieldData.key}
                          formDataKey={props.formDataKey}
                          fieldData={fieldData}
                        />
                      );
                    }

                    return (
                      <div>{`Определи поле для ${fieldData.key} в FieldWaybillStructureAndAccompanyingPerson ComponentsByKey`}</div>
                    );
                  },
                )
              }
            </Row>
          </Col>
        );
      },
      [IS_CLOSE_OR_IS_ACTIVE, props.formDataKey],
    );
  },
);

export default FieldWaybillStructureAndAccompanyingPerson;
