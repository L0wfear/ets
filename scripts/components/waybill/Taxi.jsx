import React, {Component} from 'react';
import Table from '../ui/table/Table.jsx';
import { Input, Button, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Div from '../ui/Div.jsx';


function calculateResult(data) {
  const result = _.reduce(data, (res, cur, i) => {
    if (i === data.length - 1) return res;
    if (typeof cur.RESULT !== 'undefined') {
      res += parseFloat(cur.RESULT);
    }
    return res;
  }, 0);
  return parseFloat(result).toFixed(2);
}

export default class Taxi extends Component {

  constructor(props) {
    super(props);

    this.tableCaptions = [
      "Операция",
      "Норма",
      "Значение",
      "Результат (л)"
    ];

    this.tableCols = [
      "OPERATION",
      "FUEL_RATE",
      "FACT_VALUE",
      "RESULT",
    ];

    this.tableCellRenderers = {
      OPERATION: (OPERATION, row, index) => {
        if (OPERATION === null) {
          return '';
        } else if (props.readOnly) {
          const operation = _.find(this.state.operations, (op) => OPERATION === op.value);
          return operation ? operation.label || '' : '';
        }
        return <EtsSelect clearable={false} disabled={props.readOnly} options={this.state.operations} value={OPERATION} onChange={this.handleOperationChange.bind(this, index)}/>
      },
      RESULT: (RESULT) => RESULT ? RESULT + ' л' : '',
      FACT_VALUE: (FACT_VALUE, {OPERATION, FUEL_RATE}, index) => {
        if (FACT_VALUE === 'Итого' || this.props.readOnly) return FACT_VALUE;
        const props = {
          type: 'number',
          min: 0,
          value: FACT_VALUE,
          disabled: typeof FUEL_RATE === 'undefined' || typeof OPERATION === 'undefined' || this.props.readOnly
        };
        return <Input {...props} onChange={this.handleFactValueChange.bind(this, index)} />;
      }
    };

    // this.tableHeaderRenderers = {
    //   OPERATION: (OPERATION) => <div>{OPERATION} <Glyphicon glyph="plus" className="pointer" onClick={this.addOperation.bind(this)}/></div>,
    // };

    this.state = {
      tableData: [
        // {
    		// 	OPERATION: 3,
    		// 	FUEL_RATE: 0.31,
        //   FACT_VALUE: 2,
        //   RESULT: 0.62
  		  // },
        // {
    		// 	OPERATION: 2,
    		// 	FUEL_RATE: 1.12,
        //   FACT_VALUE: 3,
        //   RESULT: 3.36,
  		  // },
        {
          OPERATION: null,
    			FACT_VALUE: 'Итого',
          RESULT: null,
  		  }
      ],
      selectedOperation: null,
      operations: [],
    }
  }

  handleChange(index, key, value) {
    const { tableData } = this.state;
    tableData[index][key] = value;

    this.setState({tableData});
  }

  handleOperationChange(index, value) {
    const { tableData } = this.state;
    tableData[index]['OPERATION'] = value;
    tableData[index]['FUEL_RATE'] = (Math.random() * (1.50 - 0.20) + 0.20).toFixed(2);
    tableData[index]['RESULT'] = typeof tableData[index].FACT_VALUE !== 'undefined' ? parseFloat(tableData[index].FUEL_RATE * tableData[index].FACT_VALUE).toFixed(2) : 0;
    tableData[tableData.length - 1].RESULT = calculateResult(tableData);

    this.setState({tableData});
  }

  addOperation() {
    const { tableData } = this.state;
    tableData.splice(tableData.length - 1, 0, {});
    this.setState({tableData});
  }

  removeOperation() {
    const { tableData } = this.state;
    if (tableData.length === 1) return;
    tableData.splice(this.state.selectedOperation, 1);
    tableData[tableData.length - 1].RESULT = calculateResult(tableData);
    this.setState({tableData});
  }

  componentWillReceiveProps(props) {
    let { operations } = props;
    operations = operations.map( ({ID, NAME}) => ({value: ID, label: NAME}));

    this.setState({operations});
  }

  selectOperation(selectedOperation) {
    this.setState({selectedOperation});
  }

  handleFactValueChange(index, e) {
    const { tableData } = this.state;
    let current = tableData[index];
        current.FACT_VALUE = e.target.value;
        current.RESULT = parseFloat(current.FUEL_RATE * current.FACT_VALUE).toFixed(2);
    tableData[tableData.length - 1].RESULT = calculateResult(tableData);

    this.setState({tableData});
  }

  render() {

		return (
      <Div className="taxi-calc-block" hidden={this.props.hidden}>
        <Div className="some-header">
          Расчет топлива по норме
          <Div className="waybills-buttons" hidden={this.props.readOnly}>
            <Button bsSize="xsmall" onClick={this.addOperation.bind(this)}>
              Добавить операцию
            </Button>
            <Button bsSize="xsmall" disabled={this.state.selectedOperation === null || this.state.selectedOperation === this.state.tableData.length - 1} onClick={this.removeOperation.bind(this)}>
              Удалить операцию
            </Button>
          </Div>
        </Div>
    		<Table title="Расчет топлива по норме"
    					 columnCaptions={this.tableCaptions}
							 data={this.state.tableData}
							 tableCols={this.tableCols}
							 pageSize={20}
							 usePagination={false}
							 cellRenderers={this.tableCellRenderers}
               onRowSelected={!this.props.readOnly ? this.selectOperation.bind(this) : undefined} />
			</Div>
    );

  }

}
