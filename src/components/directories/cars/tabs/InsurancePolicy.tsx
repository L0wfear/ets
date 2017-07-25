import * as React from 'react';

import { IBaseForm } from 'components/ui/@types/Form.h';

import BatteryRegTable from 'components/directories/autobase/battery_registry/BatteryRegTable';

const schemaMakers = {
  insurance_type_id: schema => ({ ...schema, name: 'insurance_type_name', displayName: 'TODO Руслан | + insurance_type_name' }),
};

interface IPropsBatteryTab extends IBaseForm {
  data: any[];
}

const BatteryTab: React.SFC<IPropsBatteryTab> = ({ data = [] }) =>
  <BatteryRegTable
    title={''}
    results={data}
    schemaMakers={schemaMakers}
    onRowSelected={undefined}
    initialSort={'battery_on_car__installed_at'}
    noFilter
  />;

export default BatteryTab;
