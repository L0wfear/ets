import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

import TechnicalOperationsTable from 'components/directories/technical_operation/table/TechnicalOperationsTable.jsx';
import TechnicalOperationFormWrap from 'components/directories/technical_operation/TechnicalOperationFormWrap.jsx';
import permissions from 'components/directories/technical_operation/config-data/permissions';
import { makeOptions } from 'components/ui/input/makeOptions';
import { customOptionsTableFromMainResult, customOptionsTableFromTypes, customOptionsTableFromSensorTypes } from 'components/directories/technical_operation/table/helpData';

@connectToStores(['objects'])
@exportable({ entity: 'cleaning/norm_registry' })
@staticProps({
  entity: 'technical_operation',
  permissions,
  listName: 'technicalOperationsRegistryList',
  tableComponent: TechnicalOperationsTable,
  formComponent: TechnicalOperationFormWrap,
  operations: ['LIST', 'READ'],
})
export default class TechOperationsDirectory extends ElementsList {

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('technicalOperation').getTechnicalOperationsRegistry().then((ans) => {
      const options = makeOptions({
        data: ans.result,
        options: customOptionsTableFromMainResult,
      });

      this.setState({ ...options });
      return ans;
    });

    flux.getActions('objects').getTypes().then((ans) => {
      const options = makeOptions({
        data: ans.result.rows,
        options: customOptionsTableFromTypes,
      });

      this.setState({ ...options });
      return ans;
    });

    flux.getActions('objects').getSensorTypes().then(ans => {
      const options = makeOptions({
        data: ans.result,
        options: customOptionsTableFromSensorTypes,
      });

      this.setState({ ...options });
      return ans;
    });
  }

  /**
   * @override
   */
  getAdditionalProps = () => {
    const {
      ELEMENTS = [],
      KIND_TASK_NAMES = [],
      CAR_TYPES = [],
      SENSORS_TYPE_OPTIONS = [],
    } = this.state;
    return {
      ELEMENTS,
      KIND_TASK_NAMES,
      CAR_TYPES,
      SENSORS_TYPE_OPTIONS,
    };
  }
}
