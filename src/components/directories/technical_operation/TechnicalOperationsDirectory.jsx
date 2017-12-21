import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

import TechnicalOperationsTable from 'components/directories/technical_operation/TechnicalOperationsTable.jsx';
import TechnicalOperationFormWrap from 'components/directories/technical_operation/TechnicalOperationFormWrap.jsx';

@connectToStores(['objects'])
@exportable({ entity: 'technical_operation_registry' })
@staticProps({
  entity: 'technical_operation',
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
      const {
        result = [],
      } = ans;

      const ELEMENTS = Object.entries(result.reduce((newObj, { elements = [] }) => {
        elements.forEach(({ id, name }) => {
          if (id && name) {
            newObj[name] = name;
          }
        });

        return newObj;
      }, {})).map(([value, label]) => ({ value, label }));

      this.setState({ ELEMENTS });
      return ans;
    });
    flux.getActions('objects').getTypes().then((ans) => {
      const {
        result: {
          rows = [],
        } = {},
      } = ans;

      const CAR_TYPES = Object.entries(rows.reduce((newObj, { asuods_id, short_name }) => {
        if (asuods_id && short_name) {
          newObj[short_name] = short_name;
        }

        return newObj;
      }, {})).map(([value, label]) => ({ value, label }));

      this.setState({ CAR_TYPES });
      return ans;
    });
  }

  /**
   * @override
   */
  getAdditionalProps = () => {
    const {
      ELEMENTS = [],
      CAR_TYPES = [],
    } = this.state;
    return {
      ELEMENTS,
      CAR_TYPES,
    };
  }
}
