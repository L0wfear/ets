import React, {Component} from 'react';
import Table from '../ui/table/DataTable.jsx';
import { Input, Button, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Div from '../ui/Div.jsx';
import _ from 'lodash';

function calculateResult(data) {
  const result = _.reduce(data, (res, cur, i) => {
    if (i === data.length - 1) return res;
    if (typeof cur.RESULT !== 'undefined') {
      res += parseFloat(cur.RESULT);
    }
    return res;
  }, 0);
  return parseFloat(result).toFixed(3);
}

let getResult = ({FACT_VALUE, fuel_correction_rate, FUEL_RATE}) => {
  if (typeof FACT_VALUE === 'undefined') return 0;
  if (fuel_correction_rate) {
    return parseFloat(FUEL_RATE * fuel_correction_rate * FACT_VALUE).toFixed(3);
  } else {
    return parseFloat(FUEL_RATE * 1 * FACT_VALUE).toFixed(3);
  }
}

let tableMeta = {
  cols: [{
      name: 'OPERATION',
      caption: 'Операция',
  }, {
      name: 'FUEL_RATE',
      caption: 'Норма',
  }, {
      name: 'fuel_correction_rate',
      caption: 'Поправочный коэффициент',
  }, {
      name: 'FACT_VALUE',
      caption: 'Значение',
  }, {
      name: 'RESULT',
      caption: 'Результат (л)',
  }]
};

export default class Taxes extends Component {

  constructor(props) {
    super(props);

    this.renderers = {
      OPERATION: (meta) => {
        let {data} = meta;
        let usedOperations = this.state.tableData.map((row) => row.OPERATION);
        let OPERATIONS = this.state.operations.map((e) => {
          e.disabled = (usedOperations.indexOf(e.value)+1) ? true : false;
          return e
        });
        let index = meta.rowData.rowNumber;
        if (data === null) {
          return <div/>;
        } else if (props.readOnly) {
          const operation = _.find(this.state.operations, (op) => data === op.value);
          return <div>{operation ? operation.label || '' : ''}</div>
        }
        return <EtsSelect clearable={false} disabled={props.readOnly} options={OPERATIONS} value={data} onChange={this.handleOperationChange.bind(this, index)}/>
      },
      RESULT: ({data}) => <div>{data ? data + ' л' : ''}</div>,
      fuel_correction_rate: (meta) => {
        let {data} = meta;
        let row = meta.rowData;
        if (row.OPERATION === null) return <div/>;
        return <div>{data ? parseFloat(data).toFixed(3) : 1}</div>
      },
      FACT_VALUE: (meta) => {
        let {data} = meta;
        let index = meta.rowData.rowNumber;
        let {OPERATION, FUEL_RATE} = meta.rowData;
        if (data === 'Итого' || this.props.readOnly) return <div>{data}</div>;
        const props = {
          type: 'number',
          min: 0,
          value: data,
          disabled: typeof OPERATION === 'undefined' || this.props.readOnly
        };
        return <Input {...props} onChange={this.handleFactValueChange.bind(this, index)} />;
      },
      FUEL_RATE: ({data}) => <div>{data}</div>,
    };

    this.state = {
      tableData: [
        {
          OPERATION: null,
          FUEL_RATE: null,
          fuel_correction_rate: null,
    			FACT_VALUE: 'Итого',
          RESULT: null,
  		  }
      ],
      selectedOperation: null,
      operations: [],
      fuelRates: [],
    }
  }

  handleFactValueChange(index, e) {
    const { tableData } = this.state;
    let current = tableData[index-1];
        current.FACT_VALUE = e.target.value;
        current.RESULT = getResult(tableData[index-1]);
    tableData[tableData.length - 1].RESULT = calculateResult(tableData);
    this.setState({tableData});
    this.props.onChange(tableData);
  }

  handleOperationChange(index, value) {
    const { tableData, fuelRates } = this.state;
    tableData[index-1]['OPERATION'] = value;
    const fuelRateByOperation = _.find(fuelRates, r => r.operation_id === value) || {};
    tableData[index-1]['FUEL_RATE'] = fuelRateByOperation.rate_on_date || 0;
    tableData[index-1]['RESULT'] = getResult(tableData[index-1]);
    tableData[tableData.length - 1].RESULT = calculateResult(tableData);
    this.setState({tableData});
    this.props.onChange(tableData);
  }

  addOperation() {
    const { tableData } = this.state;
    tableData.splice(tableData.length - 1, 0, {
      OPERATION: undefined,
      FUEL_RATE: undefined,
      fuel_correction_rate: this.props.correctionRate,
      FACT_VALUE: undefined,
      RESULT: undefined,
      id: tableData.length-1
    });
    this.setState({tableData});
  }

  removeOperation() {
    let { tableData, selectedOperation } = this.state;
    if (tableData.length === 1) return;
    tableData.splice(selectedOperation.id, 1);
    tableData.map((e,i) => {if (i>=selectedOperation.id) {--e.id; return e}});

    tableData[tableData.length - 1].RESULT = calculateResult(tableData);
    selectedOperation = null;
    this.setState({tableData, selectedOperation});
    this.props.onChange(tableData);
  }

  componentWillReceiveProps(props) {
    let { operations, fuelRates, taxes = this.state.tableData } = props;
    operations = operations.map( ({id, name}) => ({value: id, label: name}));

    this.setState({operations, fuelRates, tableData: taxes});
  }

  selectOperation(selectedOperation, a) {
    if (a.target.className) return;
    if (!selectedOperation.props.data.id && selectedOperation.props.data.id !== 0) return;
    this.setState({selectedOperation: selectedOperation.props.data});
  }

  render() {
    const { taxes = this.state.tableData, fuelRates = [] } = this.props;
    taxes.map((e) => {
      if (!e.FUEL_RATE) e.FUEL_RATE = null;
      if (!e.fuel_correction_rate) e.fuel_correction_rate = null;
      return e
    })
    const hasTaxes = taxes.length > 1;

		return (
      <Div className="taxi-calc-block" hidden={this.props.hidden}>
        <Div className="some-header">
          <h4>Расчет топлива по норме</h4>
          <Div hidden={fuelRates.length || hasTaxes}>
            <h5>Для данного ТС нормы расхода топлива не указаны</h5>
          </Div>
          <Div className="waybills-buttons" hidden={this.props.readOnly || !fuelRates.length}>
            <Button bsSize="xsmall" onClick={this.addOperation.bind(this)}>
              Добавить операцию
            </Button>
            <Button bsSize="xsmall" disabled={this.state.selectedOperation === null} onClick={this.removeOperation.bind(this)}>
              Удалить операцию
            </Button>
          </Div>
        </Div>
        <Div hidden={!hasTaxes}>
          <Table title="Расчет топлива по норме"
                 results={taxes}
                 tableMeta={tableMeta}
                 noFilter
                 renderers={this.renderers}
                 selected={this.state.selectedOperation}
                 selectField={'id'}
                 onRowSelected={!this.props.readOnly ? this.selectOperation.bind(this) : undefined} />
        </Div>
			</Div>
    );

  }

}
