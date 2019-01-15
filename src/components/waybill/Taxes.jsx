import * as React from 'react';
import * as PropTypes from 'prop-types';
import Table from 'components/ui/table/Table';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import * as Button from 'react-bootstrap/lib/Button';

import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import Div from 'components/ui/Div';
import { isEmpty } from 'utils/functions';
import cx from 'classnames';
import _, { get } from 'lodash';

/**
 * Компонент таксировки ТС
 * @extends React.Component
 */
export default class Taxes extends React.Component {

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
      if (!isEmpty(cur.FACT_VALUE) && !cur.is_excluding_mileage) {
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
      {
        value: 'Операция',
        cssClassName: 'min-width250',
      },
      {
        value: 'Ед. измерения',
      },
      {
        value: 'Норма',
      },
      {
        value: 'Поправочный коэффициент',
      },
      {
        value: `Значение (${type === 'odometr' ? 'км | м/ч | раз | час' : 'м/ч | раз | час'})`,
      },
      {
        value: 'Результат (л)',
      },
    ];

    this.tableCols = [
      'OPERATION',
      'measure_unit_name',
      'FUEL_RATE',
      'fuel_correction_rate',
      'FACT_VALUE',
      'RESULT',
    ];

    this.tableCellRenderers = {
      OPERATION: (OPERATION, row, index) => {
        if (props.readOnly) {
          const operation = _.find(this.state.operations, op => `${OPERATION}` === `${op.operation_id}`);

          return operation ? `${operation.name} ${row.comment ? `(${row.comment})` : ''}` || '' : '';
        }
        const options = this.state.operations.map((op) => {
          const { taxes = this.state.tableData } = this.props;
          const usedOperations = taxes.map(t => `${t.OPERATION}${t.comment ? t.comment : ''}`);
          if (usedOperations.indexOf(op.value) > -1) {
            op.disabled = true;
          }
          return op;
        });

        return <ReactSelect id={`operation_${index + 1}`} modalKey={this.props.modalKey} clearable={false} disabled={props.readOnly} options={options} value={`${OPERATION}${row.comment ? row.comment : ''}`} onChange={this.handleOperationChange.bind(this, index)} />;
      },
      measure_unit_name: measure_unit_name => measure_unit_name || '-',
      RESULT: RESULT => `${RESULT ? `${RESULT} л` : ''}`,
      fuel_correction_rate: fuel_correction_rate => (
        fuel_correction_rate ? parseFloat(fuel_correction_rate).toFixed(3) : 1
      ),
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

  static getDerivedStateFromProps(nexProps, prevProps) {
    const { fuelRates, taxes = prevProps.tableData } = nexProps;
    let { operations } = nexProps;

    operations = operations.map(data => ({
      value: `${data.id}${data.comment ? data.comment : ''}`,
      operation_id: data.id,
      rate_on_date: data.rate_on_date,
      comment: data.comment || '',
      name: data.name,
      label: data.comment ? `${data.name} (${data.comment})` : data.name,
      measure_unit_name: data.measure_unit_name,
      is_excluding_mileage: data.is_excluding_mileage,
    }));
    taxes.map(tax => ({ ...tax, RESULT: Taxes.getResult(tax) }));

    return { operations, fuelRates, tableData: taxes };
  }

  handleFactValueChange = (index, e) => {
    const { tableData } = this.state;
    const current = tableData[index];
    current.FACT_VALUE = Math.abs(e.target.value);
    if (current.is_excluding_mileage && current.measure_unit_name === 'л/подъем') {
      current.FACT_VALUE = Math.ceil(current.FACT_VALUE);
    }
    if (current.measure_unit_name === 'л/час') {
      current.FACT_VALUE = Math.ceil(current.FACT_VALUE * 1000) / 1000;
    }
    if (current.is_excluding_mileage) {
      current.iem_FACT_VALUE = current.FACT_VALUE;
    }
    current.RESULT = Taxes.getResult(current);

    this.setState({ tableData });
    this.props.onChange(tableData);
  }

  handleOperationChange = (index, rawValue, allOption) => {
    const value = get(allOption, 'operation_id', null);
    const comment = get(allOption, 'comment', '');
    const rate_on_date = get(allOption, 'rate_on_date', 0);
    const is_excluding_mileage = get(allOption, 'is_excluding_mileage', false);
    const measure_unit_name = get(allOption, 'measure_unit_name', '-');

    const { tableData } = this.state;
    const last_is_excluding_mileage = tableData[index].is_excluding_mileage;

    tableData[index].OPERATION = value;
    tableData[index].comment = comment;
    tableData[index].FUEL_RATE = rate_on_date;
    tableData[index].is_excluding_mileage = is_excluding_mileage;
    if (tableData[index].is_excluding_mileage) {
      tableData[index].iem_FACT_VALUE = tableData[index].FACT_VALUE;
      tableData[index].FACT_VALUE = 0;
    } else if (last_is_excluding_mileage) {
      tableData[index].FACT_VALUE = tableData[index].iem_FACT_VALUE || tableData[index].FACT_VALUE;
    }
    tableData[index].RESULT = Taxes.getResult(tableData[index]);
    tableData[index].measure_unit_name = measure_unit_name;

    this.setState({ tableData });
    this.props.onChange(tableData);
  }

  addOperation = () => {
    const { tableData } = this.state;
    const { correctionRate, baseFactValue } = this.props;
    const overallValue = Taxes.calculateFinalFactValue(this.state.tableData);

    const value = baseFactValue || baseFactValue === 0 ? (baseFactValue - overallValue).toFixed(3) : null;
    tableData.push({ fuel_correction_rate: correctionRate, FACT_VALUE: value });
    this.setState({ tableData });
  }

  removeOperation = () => {
    const { tableData } = this.state;
    tableData.splice(this.state.selectedOperation, 1);
    this.setState({ tableData });
    this.props.onChange(tableData);
  }

  selectOperation = (selectedOperation) => {
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
    const finalFactValueClassName = cx({
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
            <Button id="add-operation" bsSize="xsmall" onClick={this.addOperation} disabled={this.state.operations.length === taxes.length}>
              Добавить операцию
            </Button>
            <Button id="remove-operation" bsSize="xsmall" disabled={this.state.selectedOperation === null || taxes.length === 0} onClick={this.removeOperation}>
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
          <div className="taxes-result-label">
            <span className={finalFactValueClassName}>{finalFactValue}</span>
            <span> (км | м/ч)</span>
          </div>
          <div className="taxes-result-value">{finalResult} л.</div>
        </Div>
      </Div>
    );
  }

}
