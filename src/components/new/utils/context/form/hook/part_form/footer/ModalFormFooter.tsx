import * as React from 'react';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import DefaultModalFooter from './default/DefaultModalFooter';
import { SchemaFormContextFooter } from 'components/new/utils/context/form/@types';
import WaybillModalFooter from './waybill/WaybillModalFooter';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ModalFormFooterProps = {
  formDataKey: string;
};

const ComponentsByKey: Record<SchemaFormContextFooter['type'], React.ComponentType<ModalFormFooterProps>> = {
  default: DefaultModalFooter,
  waybill: WaybillModalFooter,
};

const ModalFormFooter: React.FC<ModalFormFooterProps> = React.memo(
  (props) => {
    const formDataFooterValue = useForm.useFormDataSchemaFooter<any>(props.formDataKey);

    const children = React.useMemo(
      () => {
        const ComponentName = ComponentsByKey[formDataFooterValue.type];
        if (ComponentName) {
          return (
            <ComponentName formDataKey={props.formDataKey} />
          );
        }
        return <div>{`Определи тип футера для ${formDataFooterValue.type} в ModalFormFooter ComponentsByKey`}</div>;
      },
      [formDataFooterValue, props],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.ModalFooter>
          {children}
        </EtsBootstrap.ModalFooter>
      ),
      [children],
    );
  },
);

export default ModalFormFooter;
