import * as React from 'react';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import DefaultModalHeader from './default/DefaultHeader';
import WaybillHeader from './waybill/WaybillHeader';
import { SchemaFormContextHeader } from 'components/@next/@form/@types';

type ModalFormHeaderProps = {
  formDataKey: string;
  onHide?: (...arg: any) => any;
};

const ComponentsByKey: Record<SchemaFormContextHeader['type'], React.ComponentType<ModalFormHeaderProps>> = {
  default: DefaultModalHeader,
  waybill: WaybillHeader,
};

const ModalFormHeader: React.FC<ModalFormHeaderProps> = React.memo(
  (props) => {
    const formDataHeaderValue = useForm.useFormDataSchemaHeader<any>(props.formDataKey);
    const ComponentName = ComponentsByKey[formDataHeaderValue.type];

    return ComponentName
      ? (
        <ComponentName formDataKey={props.formDataKey} onHide={props.onHide} />
      )
      : (
        <div>{`Определи тип шапки для ${formDataHeaderValue.type} в ModalFormHeader ComponentsByKey`}</div>
      );
  },
);

export default ModalFormHeader;
