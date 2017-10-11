import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Table from 'components/ui/table/Table.jsx';
import { FormControl, Button } from 'react-bootstrap';
import EtsSelect from 'components/ui/input/EtsSelect';
import Div from 'components/ui/Div.jsx';
import { isEmpty } from 'utils/functions';
import cx from 'classnames';
import _ from 'lodash';

/**
 * Компонент таксировки ТС
 * @extends React.Component
 */
@autobind
export default class Taxes extends Component {

  static get propTypes() {
    return {
      type: PropTypes.string.isRequired,
      title: PropTypes.string,
      noDataMessage: PropTypes.string,
      taxes: PropTypes.arrayOf(PropTypes.object),
      readOnly: PropTypes.bool,
      hidden: PropTypes.bool,
      correctionRate: PropTypes.number,
      baseFactValue: PropTypes.string,
      fuelRates: PropTypes.array,
      onChange: PropTypes.func.isRequired,
    };
  }

  static getResult({ FACT_VALUE, fuel_correction_rate, FUEL_RATE }) {
    if (isEmpty(FACT_VALUE) || isEmpty(fuel_correction_rate) || isEmpty(FUEL_RATE)) {
      return 0;
    }
    return parseFloat(FUEL_RATE * fuel_correction_rate * FACT_VALUE).toFixed(3);
  }

  static calculateFinalResult(data) {
    if (!data || (data && !data.length)) {
      return 0;
    }
    const result = _.reduce(data, (res, cur) => {
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
    const result = _.reduce(data, (res, cur) => {
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
      'Операция',
      'Норма',
      'Поправочный коэффициент',
      `Значение (${type === 'odometr' ? 'км' : 'м/ч'})`,
      'Результат (л)',
    ];

    this.tableCols = [
      'OPERATION',
      'FUEL_RATE',
      'fuel_correction_rate',
      'FACT_VALUE',
      'RESULT',
    ];

    this.tableCellRenderers = {
      OPERATION: (OPERATION, row, index) => {
        if (props.readOnly) {
          const operation = _.find(this.state.operations, op => OPERATION === op.value);
          return operation ? operation.label || '' : '';
        }
        const options = this.state.operations.map((op) => {
          const { taxes = this.state.tableData } = this.props;
          const usedOperations = taxes.map(t => t.OPERATION);
          if (usedOperations.indexOf(op.value) > -1) {
            op.disabled = true;
          }
          return op;
        });
        return <EtsSelect clearable={false} disabled={props.readOnly} options={options} value={OPERATION} onChange={this.handleOperationChange.bind(this, index)} />;
      },
      RESULT: RESULT => `${RESULT ? RESULT + ' л' : ''}`,
      fuel_correction_rate: (fuel_correction_rate, row) => {
        return fuel_correction_rate ? parseFloat(fuel_correction_rate).toFixed(3) : 1;
      },
      FACT_VALUE: (FACT_VALUE, { OPERATION, FUEL_RATE }, index) => {
        const factValueProps = {
          type: 'number',
          min: 0,
          value: FACT_VALUE,
          disabled: typeof FUEL_RATE === 'undefined' || typeof OPERATION === 'undefined' || this.props.readOnly,
        };
        return (
          <div className="form-group">
            { false && <label className="control-label"><span>{'label'}</span></label>}
            <FormControl {...factValueProps} onChange={this.handleFactValueChange.bind(this, index)} />
          </div>
        );
      },
    };

    this.state = {
      tableData: [],
      selectedOperation: null,
      operations: [],
      fuelRates: [],
    };
  }

  componentWillReceiveProps(props) {
    const { fuelRates, taxes = this.state.tableData } = props;
    let { operations } = props;
    operations = operations.map(({ id, name }) => ({ value: id, label: name }));
    taxes.map(tax => ({ ...tax, RESULT: Taxes.getResult(tax) }));
    this.setState({ operations, fuelRates, tableData: taxes });
  }

  handleFactValueChange(index, e) {
    const { tableData } = this.state;
    const current = tableData[index];
    current.FACT_VALUE = Math.abs(e.target.value);
    current.RESULT = Taxes.getResult(current);

    this.setState({ tableData });
    this.props.onChange(tableData);
  }

  handleOperationChange(index, value) {
    const { tableData, fuelRates } = this.state;
    tableData[index].OPERATION = value;
    const fuelRateByOperation = _.find(fuelRates, r => r.operation_id === value) || {};
    tableData[index].FUEL_RATE = fuelRateByOperation.rate_on_date || 0;
    tableData[index].RESULT = Taxes.getResult(tableData[index]);

    this.setState({ tableData });
    this.props.onChange(tableData);
  }

  addOperation() {
    const { tableData } = this.state;
    const { correctionRate, baseFactValue } = this.props;
    const overallValue = Taxes.calculateFinalFactValue(this.state.tableData);
    const value = baseFactValue ? (baseFactValue - overallValue).toFixed(3) : null;
    tableData.push({ fuel_correction_rate: correctionRate, FACT_VALUE: value });
    this.setState({ tableData });
  }

  removeOperation() {
    const { tableData } = this.state;
    tableData.splice(this.state.selectedOperation, 1);
    this.setState({ tableData });
    this.props.onChange(tableData);
  }

  selectOperation(selectedOperation) {
    this.setState({ selectedOperation });
  }

  render() {
    const { taxes = this.state.tableData, fuelRates = [],
      title = 'Расчет топлива по норме', hidden,
      noDataMessage = 'Для данного ТС нормы расхода топлива не указаны',
      baseFactValue } = this.props;
    const hasTaxes = taxes.length > 0;
    const finalResult = Taxes.calculateFinalResult(taxes);
    const finalFactValue = Taxes.calculateFinalFactValue(taxes);
    const finalFactValueEqualsBaseValue = parseFloat(baseFactValue).toFixed(3) === parseFloat(finalFactValue).toFixed(3);
    const finalFactValueClassName = cx('taxes-result-label', {
      'taxes-result-label-positive': finalFactValueEqualsBaseValue,
      'taxes-result-label-negative': !finalFactValueEqualsBaseValue,
    });

    return (
      <Div className="taxi-calc-block" hidden={hidden}>
        <Div className="some-header">
          <h4>{title}</h4>
          <Div hidden={fuelRates.length || hasTaxes}>
            <h5>{noDataMessage}</h5>
          </Div>
          <Div className="waybills-buttons" hidden={this.props.readOnly || !fuelRates.length}>
            <Button bsSize="xsmall" onClick={this.addOperation} disabled={this.state.operations.length === taxes.length}>
              Добавить операцию
            </Button>
            <Button bsSize="xsmall" disabled={this.state.selectedOperation === null || taxes.length === 0} onClick={this.removeOperation}>
              Удалить операцию
            </Button>
          </Div>
        </Div>
        <Div hidden={!hasTaxes}>
          <Table
            title="Расчет топлива по норме"
            columnCaptions={this.tableCaptions}
            data={taxes}
            tableCols={this.tableCols}
            pageSize={10}
            usePagination={false}
            cellRenderers={this.tableCellRenderers}
            onRowSelected={!this.props.readOnly ? this.selectOperation : undefined}
          />
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
