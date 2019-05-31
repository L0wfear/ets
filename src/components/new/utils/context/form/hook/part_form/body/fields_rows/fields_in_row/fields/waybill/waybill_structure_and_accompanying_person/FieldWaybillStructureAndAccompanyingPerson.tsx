import * as React from 'react';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import { FieldDataWaybillStructureAndAccompanyingPerson } from 'components/new/utils/context/form/@types/fields/waybill';
import FieldWaybillStructureId from './structure/FieldWaybillStructureId';
import FieldWaybillAccompanyingPersonId from './accompanying_person_id/FieldWaybillAccompanyingPersonId';
import { FieldDataWaybillStuctureId, FieldDataWaybillAccompanyingPersonId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillStructureAndAccompanyingPersonProps = {
  fieldData: FieldDataWaybillStructureAndAccompanyingPerson;
  formDataKey: string;
};

const FieldDataStructureId: FieldDataWaybillStuctureId = {
  key: 'structure_id',
  title: 'Подразделение',
};
const FieldDataAccompanyingPersonId: FieldDataWaybillAccompanyingPersonId = {
  key: 'accompanying_person_id',
  title: 'Сопровождающий',
  clearable: true,
};

const FieldWaybillStructureAndAccompanyingPerson: React.FC<FieldWaybillStructureAndAccompanyingPersonProps> = React.memo(
  (props) => {
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={IS_CLOSE_OR_IS_ACTIVE ? 4 : 6}>
            <EtsBootstrap.Row>
              <FieldWaybillStructureId formDataKey={props.formDataKey} fieldData={FieldDataStructureId} />
              <FieldWaybillAccompanyingPersonId formDataKey={props.formDataKey} fieldData={FieldDataAccompanyingPersonId} />
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
        );
      },
      [props, IS_CLOSE_OR_IS_ACTIVE, props.formDataKey],
    );
  },
);

export default FieldWaybillStructureAndAccompanyingPerson;
