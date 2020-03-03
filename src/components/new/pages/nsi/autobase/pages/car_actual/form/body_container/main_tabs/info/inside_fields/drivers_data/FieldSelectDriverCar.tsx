import * as React from 'react';

import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { FormWithHandleChange } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import useCarDriversList from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/drivers_data/useCarDriversList';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { componentsToDriver } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/drivers_data/component_to_select';

type Props = {
  gov_number: CarWrap['gov_number'];
  type_id: CarWrap['type_id'];
  drivers_data: CarWrap['drivers_data'];
  onChange: FormWithHandleChange<CarWrap>;
  isPermitted: boolean;
  page: string;
  path: string;
};

const FieldSelectDriverCar: React.FC<Props> = React.memo(
  (props) => {
    const {
      drivers_data,
      gov_number,
    } = props;

    const {
      primaryDriverOptions,
      secondaryDriverOptions,
    } = useCarDriversList(
      drivers_data,
      gov_number,
      props,
    );

    const onChange = React.useCallback(
      (key, value) => {
        props.onChange({
          drivers_data: {
            ...drivers_data,
            [key]: value,
          },
        });
      },
      [drivers_data],
    );

    return (
      <EtsBootstrap.Row>
        <EtsBootstrap.Col md={6}>
          <ExtField
            id="primary_drivers"
            type="select"
            multi
            label="Основной водитель/машинист"
            options={primaryDriverOptions}
            value={drivers_data.primary_drivers}
            onChange={onChange}
            boundKeys="primary_drivers"
            disabled={!props.isPermitted}
            components={componentsToDriver}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={6}>
          <ExtField
            id="secondary_drivers"
            type="select"
            multi
            label="Вторичный водитель/машинист"
            options={secondaryDriverOptions}
            value={drivers_data.secondary_drivers}
            onChange={onChange}
            boundKeys="secondary_drivers"
            disabled={!props.isPermitted}
            components={componentsToDriver}
          />
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  },
);

export default FieldSelectDriverCar;
