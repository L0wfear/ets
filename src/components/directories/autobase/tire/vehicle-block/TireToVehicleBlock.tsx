import * as React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { ITireToCar} from 'api/@types/services/autobase.h';

import DataTableComponent from 'components/ui/table/DataTable';
import { meta, renderers } from './table-schema';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

interface IPropsTireToVehicleBlock {
  list: ITireToCar[];
}

interface IStateTireToVehicleBlock {

}

class TireToVehicleBlock extends React.Component<IPropsTireToVehicleBlock, IStateTireToVehicleBlock> {
  render() {
    const extendedRenderers: ISchemaRenderer  = renderers(this.props);

    return (
      <div>
        <div className="pull-right">
          <ButtonToolbar>
            <Button>Добавить ТС</Button>
            <Button>Удалить ТС</Button>
          </ButtonToolbar>
        </div>
        <DataTable
          title=""
          results={[]}
          tableMeta={meta}
          renderers={extendedRenderers}
          noFilter
          enumerated={false}
          enableSort={false}
          initialSort={false}
        />
      </div>
    );
  }
}

export default TireToVehicleBlock;
