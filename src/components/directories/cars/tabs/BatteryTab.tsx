import * as React from 'react';

import { IBaseForm } from 'components/ui/@types/Form.h';

import { hiddeColumns } from 'components/ui/table/utils';
import BatteryRegTable from 'components/directories/autobase/battery_registry/BatteryRegTable';

const schemaMakers = {
  name_org: hiddeColumns,
  battery__serial_number: hiddeColumns,
  todo_pr_date_install: hiddeColumns,
  car__gov_number: hiddeColumns,
  battery_manufacturer__name: schema => ({ ...schema, orderNum: 0 }),
  battery__released_at: schema => ({ ...schema, orderNum: 2 }),
  battery_on_car__installed_at: schema => ({ ...schema, orderNum: 3 }),
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
