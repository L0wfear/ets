import * as React from 'react';

import { IBaseForm } from 'components/ui/@types/Form.h';

import TireTable from 'components/directories/autobase/tire/TireTable';
import { hiddeColumns } from 'components/ui/table/utils';

const schemaMakers = {
  gov_number: hiddeColumns,
  comment: hiddeColumns,
  company_name: hiddeColumns,
  installed_at: schema => ({ ...schema, orderNum: 1 }),
  tire_size_id: schema => ({ ...schema, displayName: 'Размер шины' }),
};

interface IPropsTireTab extends IBaseForm {
  data: any[];
}

const TireTab: React.SFC<IPropsTireTab> = ({ data = [] }) =>
  <TireTable
    title={''}
    results={data}
    schemaMakers={schemaMakers}
    onRowSelected={undefined}
    initialSort={'installed_at'}
    noFilter
  />;

export default TireTab;
