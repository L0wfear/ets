import React, {Component} from 'react';
import Table from '../ui/table/Table.jsx';
import { Input, Button, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Div from '../ui/Div.jsx';
import { isEmpty } from 'utils/functions';
import cx from 'classnames';

let getResult = ({FACT_VALUE, fuel_correction_rate, FUEL_RATE}) => {
  if (typeof FACT_VALUE === 'undefined') return 0;
  return parseFloat(FUEL_RATE * fuel_correction_rate * FACT_VALUE).toFixed(3);
}

export default class Taxes extends Component {

  static propTypes = {
    type: React.PropTypes.string.isRequired
  }

  static calculateFinalResult(data) {
    if (!data || (data && !data.length)) {
      return 0;
    }
    const result = _.reduce(data, (res, cur, i) => {
      if (typeof cur.RESULT !== 'undefined') {
        res += parseFloat(cur.RESULT);
      }
      return res;
    }, 0);
    return parseFloat(result).toFixed(3);
  }

  static calculateFinalFactValue(data) {
    if (!data || (data && !data.length)) {
      return 0;
    }
    const result = _.reduce(data, (res, cur, i) => {
      if (!isEmpty(cur.FACT_VALUE)) {
        res += parseFloat(cur.FACT_VALUE);
      }
      return res;
    }, 0);
    return parseFloat(result).toFixed(3);
  }

  constructor(props) {
    super(props);

    const { type } = props;

    this.tableCaptions = [
      "Операция",
      "Норма",
      "Поправочный коэффициент",
      `Значение (${type === 'odometr' ? 'км' : 'м/ч' })`,
      "Результат (л)"
    ];

    this.tableCols = [
      "OPERATION",
      "FUEL_RATE",
      "fuel_correction_rate",
      "FACT_VALUE",
      "RESULT",
    ];

    this.tableCellRenderers = {
      OPERATION: (OPERATION, row, index) => {
        if (props.readOnly) {
          const operation = _.find(this.state.operations, (op) => OPERATION === op.value);
          return operation ? operation.label || '' : '';
        }
        const options = this.state.operations.map((op) => {
          const { taxes = this.state.tableData} = this.props;
          const usedOperations = taxes.map(t => t.OPERATION);
          if (usedOperations.indexOf(op.value) > -1) {
            op.disabled = true;
          }
          return op;
        });
        return <EtsSelect clearable={false} disabled={props.readOnly} options={options} value={OPERATION} onChange={this.handleOperationChange.bind(this, index)}/>
      },
      RESULT: (RESULT) => `${RESULT ? RESULT + ' л' : ''}`,
      fuel_correction_rate: (fuel_correction_rate, row) => {
        return fuel_correction_rate ? parseFloat(fuel_correction_rate).toFixed(3) : 1
      },
      FACT_VALUE: (FACT_VALUE, {OPERATION, FUEL_RATE}, index) => {
        const props = {
          type: 'number',
          min: 0,
          value: FACT_VALUE,
          disabled: typeof FUEL_RATE === 'undefined' || typeof OPERATION === 'undefined' || this.props.readOnly
        };
        return <Input {...props} onChange={this.handleFactValueChange.bind(this, index)} />;
      }
    };

    this.state = {
      tableData: [],
      selectedOperation: null,
      operations: [],
      fuelRates: [],
    }
  }

  handleFactValueChange(index, e) {
    const { tableData } = this.state;
    let current = tableData[index];
    current.FACT_VALUE = e.target.value;
    current.RESULT = getResult(tableData[index]);

    this.setState({tableData});
    this.props.onChange(tableData);
  }

  handleOperationChange(index, value) {
    const { tableData, fuelRates } = this.state;
    tableData[index]['OPERATION'] = value;
    const fuelRateByOperation = _.find(fuelRates, r => r.operation_id === value) || {};
    tableData[index]['FUEL_RATE'] = fuelRateByOperation.rate_on_date || 0;
    tableData[index]['RESULT'] = getResult(tableData[index]);

    this.setState({tableData});
    this.props.onChange(tableData);
  }

  addOperation() {
    const { tableData } = this.state;
    const { correctionRate } = this.props;
    tableData.push({fuel_correction_rate: correctionRate});
    this.setState({tableData});
  }

  removeOperation() {
    const { tableData } = this.state;
    tableData.splice(this.state.selectedOperation, 1);
    this.setState({tableData});
    this.props.onChange(tableData);
  }

  componentWillReceiveProps(props) {
    let { operations, fuelRates, taxes = this.state.tableData } = props;
    operations = operations.map( ({id, name}) => ({value: id, label: name}));

    this.setState({operations, fuelRates, tableData: taxes});
  }

  selectOperation(selectedOperation) {
    this.setState({selectedOperation});
  }

  render() {

    const { taxes = this.state.tableData, fuelRates = [], type,
      title = 'Расчет топлива по норме',
      noDataMessage = 'Для данного ТС нормы расхода топлива не указаны',
      baseFactValue } = this.props;
    const hasTaxes = taxes.length > 0;
    const finalResult = Taxes.calculateFinalResult(taxes);
    const finalFactValue = Taxes.calculateFinalFactValue(taxes);
    const finalFactValueEqualsBaseValue = parseFloat(baseFactValue).toFixed(3) === parseFloat(finalFactValue).toFixed(3);
    const finalFactValueClassName = cx('taxes-result-label', {
      'taxes-result-label-positive': finalFactValueEqualsBaseValue,
      'taxes-result-label-negative': !finalFactValueEqualsBaseValue
    });

		return (
      <Div className="taxi-calc-block" hidden={this.props.hidden}>
        <Div className="some-header">
          <h4>{title}</h4>
          <Div hidden={fuelRates.length || hasTaxes}>
            <h5>{noDataMessage}</h5>
          </Div>
          <Div className="waybills-buttons" hidden={this.props.readOnly || !fuelRates.length}>
            <Button bsSize="xsmall" onClick={this.addOperation.bind(this)} disabled={this.state.operations.length === taxes.length}>
              Добавить операцию
            </Button>
            <Button bsSize="xsmall" disabled={this.state.selectedOperation === null} onClick={this.removeOperation.bind(this)}>
              Удалить операцию
            </Button>
          </Div>
        </Div>
        <Div hidden={!hasTaxes}>
          <Table title="Расчет топлива по норме"
            columnCaptions={this.tableCaptions}
            data={taxes}
            tableCols={this.tableCols}
            pageSize={10}
            usePagination={false}
            cellRenderers={this.tableCellRenderers}
            onRowSelected={!this.props.readOnly ? this.selectOperation.bind(this) : undefined} />
        </Div>
        <Div className="taxes-result" hidden={!hasTaxes}>
          <div className="taxes-result-label">Итого</div>
          <div className={finalFactValueClassName}>{finalFactValue}</div>
          <div className="taxes-result-value">{finalResult} л.</div>
        </Div>
			</Div>
    );

  }

}
