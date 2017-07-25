import * as React from 'react';

import { IBaseForm } from 'components/ui/@types/Form.h';

import Table from 'components/directories/autobase/insurance_policy/InsurancePolicyTable';

const schemaMakers = {
};

interface IPropsBatteryTab extends IBaseForm {
  data: any[];
}

const BatteryTab: React.SFC<IPropsBatteryTab> = ({ data = [] }) =>
  <Table
    title={''}
    results={data}
    schemaMakers={schemaMakers}
    onRowSelected={undefined}
    initialSort={'battery_on_car__installed_at'}
    noFilter
  />;

export default BatteryTab;
