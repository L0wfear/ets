import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

import TechnicalOperationFormWrap from './TechnicalOperationFormWrap.jsx';
import TechnicalOperationsTable from './TechnicalOperationsTable.jsx';

@connectToStores(['objects'])
@exportable({ entity: 'technical_operation' })
@staticProps({
  entity: 'technical_operation',
  listName: 'technicalOperationsRegistryList',
  tableComponent: TechnicalOperationsTable,
  operations: ['UPDATE'],
})
export default class TechOperationsDirectory extends ElementsList {

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('technicalOperation').getTechnicalOperationsRegistry(true).then((ans) => {
      const {
        result = [],
      } = ans;

      const ELEMENTS = Object.entries(result.reduce((newObj, { elements = [] }) => {
        elements.forEach(({ id, name }) => {
          if (id && name) {
            newObj[id] = name;
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
          newObj[asuods_id] = short_name;
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
