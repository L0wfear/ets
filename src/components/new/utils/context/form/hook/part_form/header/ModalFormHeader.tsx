import * as React from 'react';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import DefaultModalHeader from './default/DefaultHeader';
import WaybillHeader from './waybill/WaybillHeader';
import { SchemaFormContextHeader } from 'components/new/utils/context/form/@types';

type ModalFormHeaderProps = {
  formDataKey: string;
};

const ComponentsByKey: Record<SchemaFormContextHeader['type'], React.ComponentType<ModalFormHeaderProps>> = {
  default: DefaultModalHeader,
  waybill: WaybillHeader,
};

const ModalFormHeader: React.FC<ModalFormHeaderProps> = React.memo(
  (props) => {
    const formDataHeaderValue = useForm.useFormDataSchemaHeader<any>(props.formDataKey);

    return React.useMemo(
      () => {
        const ComponentName = ComponentsByKey[formDataHeaderValue.type];
        if (ComponentName) {
          return (
            <ComponentName formDataKey={props.formDataKey} />
          );
        }
        return <div>{`Определи тип шапки для ${formDataHeaderValue.type} в ModalFormHeader ComponentsByKey`}</div>;
      },
      [props, formDataHeaderValue],
    );
  },
);

export default ModalFormHeader;
