import * as React from 'react';

import { IBaseForm } from 'components/ui/@types/Form.h';

import Table from 'components/directories/autobase/tech_inspection/TechInspectionTable';

const schemaMakers = {
};

interface IPropsTireTab extends IBaseForm {
  data: any[];
}

const TireTab: React.SFC<IPropsTireTab> = ({ data = [] }) =>
  <Table
    title={''}
    results={data}
    schemaMakers={schemaMakers}
    onRowSelected={undefined}
    initialSort={''}
    noFilter
  />;

export default TireTab;
