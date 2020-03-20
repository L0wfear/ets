import * as React from 'react';
import * as PropTypes from 'prop-types';
import { get } from 'lodash';

import Table from 'components/old/waybill/Table';

import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';

import Div from 'components/old/ui/Div';
import { isEmpty } from 'utils/functions';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import {
  EtsHeaderContainer,
  EtsHeaderContainerWrap,
} from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { SpanGreen, FooterEnd, SpanRed } from 'global-styled/global-styled';
import { ButtonTableInput } from 'components/new/ui/table_input/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { HrLineWaybill } from 'components/new/pages/login/styled/styled';
import styled from 'styled-components';

export const TaxiCalcBlock = styled(Div)`
`;

/**
 * Компонент таксировки ТС
 * @extends React.Component
 */
export default class Taxes extends React.Component<any, any> {
  static get propTypes() {
    return {
      type: PropTypes.string.isRequired,
      title: PropTypes.string,
      noDataMessage: PropTypes.string,
      taxes: PropTypes.arrayOf(PropTypes.object),
      readOnly: PropTypes.bool,
      hidden: PropTypes.bool,
      correctionRate: PropTypes.number,
      baseFactValue: PropTypes.any,
      fuelRates: PropTypes.array,
      onChange: PropTypes.func.isRequired,
    };
  }

  static getResult({ FACT_VALUE, fuel_correction_rate, FUEL_RATE }) {
    if (
      isEmpty(FACT_VALUE)
      || isEmpty(fuel_correction_rate)
      || isEmpty(FUEL_RATE)
    ) {
      return 0;
    }
    return FUEL_RATE * fuel_correction_rate * FACT_VALUE;
  }

  static calculateFinalResult(data) {
    if (!data || (data && !data.length)) {
      return 0;
    }
    const result = data.reduce(
      (res, cur) => {
        if (typeof cur.RESULT !== 'undefined') {
          res += parseFloat(cur.RESULT); // eslint-disable-line
        }
        return res;
      },
      0,
    );
    return parseFloat(result);
  }

  static calculateFinalFactValue(data) {
    if (!data || (data && !data.length)) {
      return 0;
    }
    const result = data.reduce(
      (res, cur) => {
        if (!isEmpty(cur.FACT_VALUE) && !cur.is_excluding_mileage) {
          res += parseFloat(cur.FACT_VALUE); // eslint-disable-line
        }
        return res;
      },
      0,
    );
    return parseFloat(result);
  }

  tableCaptions: Array<any>;
  tableCols: Array<string>;
  tableCellRenderers: Record<string, any>;

  constructor(props) {
    super(props);

    const { type } = props;

    this.tableCaptions = [
      {
        value: 'Операция',
        width: 250,
      },
      {
        value: 'Ед. измерения',
        width: 100,
      },
      {
        value: 'Норма',
        width: 75,
      },
      {
        value: 'Поправочный коэффициент',
        width: 125,
      },
      {
        value: `Значение (${
          type === 'odometr' ? 'км | м/ч | раз | час' : 'м/ч | раз | час'
        })`,
        width: 150,
      },
      {
        value: 'Результат (л)',
        width: 125,
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
        if (this.props.readOnly) {
          return row.operation_name;
        }
        const options = this.state.operations.map((op) => {
          const { taxes = this.state.tableData } = this.props;
          const usedOperations = taxes.map((t) => t.uniqKey);
          if (usedOperations.indexOf(op.value) > -1) {
            op.isDisabled = true;
          }
          return op;
        });

        const errors = get(this.state, 'errorsAll.tax_data_rows', []);
        const errorsMsg = errors.length
          ? get(errors, `${index}.OPERATION`)
          : '';

        return (
          <div>
            <ReactSelect
              clearable={false}
              modalKey={this.props.modalKey}
              id={`norm_operation_id_${index}`}
              disabled={this.props.readOnly}
              options={options}
              value={row.uniqKey}
              onChange={this.handleOperationChange.bind(this, index)}
            />
            <ErrorsBlock hidden={!errorsMsg} error={errorsMsg} />
          </div>
        );
      },
      measure_unit_name: (measure_unit_name) => measure_unit_name || '-',
      FUEL_RATE: (FUEL_RATE) => FUEL_RATE
        ? parseFloat(FUEL_RATE).toFixed(3)?.replace('.', ',')
        : '',
      RESULT: (RESULT) => {
        const resultView = RESULT ? parseFloat(RESULT).toFixed(3)?.replace('.', ',') : '';
        return `${resultView ? `${resultView} л` : ''}`;
      },
      fuel_correction_rate: (fuel_correction_rate) =>
        fuel_correction_rate ? parseFloat(fuel_correction_rate).toFixed(3)?.replace('.', ',') : 1,
      FACT_VALUE: (FACT_VALUE, { OPERATION, FUEL_RATE }, index) => {
        const factValueProps = {
          type: 'number',
          value: parseFloat(FACT_VALUE),
          id: `FACT_VALUE_${index}`,
          disabled:
            typeof FUEL_RATE === 'undefined'
            || typeof OPERATION === 'undefined'
            || this.props.readOnly,
        };

        const errors = get(this.state, 'errorsAll.tax_data_rows', []);
        const errorsMsg = errors.length
          ? get(errors, `${index}.FACT_VALUE`)
          : '';

        return (
          <div className="form-group">
            {false && (
              <label className="control-label">
                <span>{'label'}</span>
              </label>
            )}
            <EtsBootstrap.FormControl
              {...factValueProps}
              onChange={this.handleFactValueChange.bind(this, index)}
            />
            <ErrorsBlock hidden={!errorsMsg} error={errorsMsg} />
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

  static getDerivedStateFromProps(nexProps, prevState) {
    const { fuelRates, taxes = prevState.tableData, errorsAll } = nexProps;
    let { operations } = nexProps;

    operations = operations.map((data) => ({
      value: data.uniqKey,
      operation_id: data.id,
      rate_on_date: data.rate_on_date,
      operation_name: data.name,
      comment: data.comment || '',
      label: data.name,
      measure_unit_name: data.measure_unit_name,
      is_excluding_mileage: data.is_excluding_mileage,
    }));

    taxes.forEach((data) => {
      if (data.originOperation) {
        operations.push({
          value: data.uniqKey,
          operation_id: data.OPERATION,
          comment: data.comment,
          rate_on_date: data.FUEL_RATE,
          operation_name: data.operation_name,
          label: data.operation_name,
          measure_unit_name: data.measure_unit_name,
          is_excluding_mileage: data.is_excluding_mileage,
          isDisabled: true,
        });
      }
    });

    taxes.map((tax) => ({ ...tax, RESULT: Taxes.getResult(tax) }));

    return { operations, fuelRates, tableData: taxes, errorsAll };
  }

  handleFactValueChange = (index, e) => {
    const { tableData } = this.state;
    const current = tableData[index];
    const oldCurrVal = current.FACT_VALUE;
    current.FACT_VALUE = e.target.value === '' ? '' : Math.abs(e.target.value);
    const threeSybolsAfterComma = /^([0-9]{1,})\.([0-9]{4,})$/.test(
      current.FACT_VALUE,
    ); // есть 3 знака после запятой
    if (
      current.is_excluding_mileage
      && current.measure_unit_name === 'л/подъем'
    ) {
      current.FACT_VALUE = Math.ceil(current.FACT_VALUE);
    }
    // если пользак уже ввел 3 знака после запятой, то он больше ничего не может ввести
    if (current.measure_unit_name === 'л/час' && threeSybolsAfterComma) {
      current.FACT_VALUE = oldCurrVal;
    }

    if (current.is_excluding_mileage) {
      current.iem_FACT_VALUE = current.FACT_VALUE;
    }

    current.RESULT = Taxes.getResult(current);
    this.setState({ tableData });
    this.props.onChange(tableData);
  };

  handleOperationChange = (index, rawValue, allOption) => {
    const isDisabled = get(allOption, 'isDisabled', false);
    if (!isDisabled) {
      const value = get(allOption, 'operation_id', null);
      const operation_name = get(allOption, 'operation_name', '');
      const rate_on_date = get(allOption, 'rate_on_date', 0);
      const comment = get(allOption, 'comment', '');
      const is_excluding_mileage = get(
        allOption,
        'is_excluding_mileage',
        false,
      );
      const measure_unit_name = get(allOption, 'measure_unit_name', '-');

      const { tableData } = this.state;
      const last_is_excluding_mileage = tableData[index].is_excluding_mileage;

      tableData[index].uniqKey = rawValue;
      tableData[index].OPERATION = value;
      tableData[index].comment = comment;
      tableData[index].operation_name = operation_name;
      tableData[index].FUEL_RATE = rate_on_date;
      tableData[index].is_excluding_mileage = is_excluding_mileage;
      if (tableData[index].is_excluding_mileage) {
        tableData[index].iem_FACT_VALUE = tableData[index].FACT_VALUE;
        tableData[index].FACT_VALUE = 0;
      } else if (last_is_excluding_mileage) {
        tableData[index].FACT_VALUE
          = tableData[index].iem_FACT_VALUE || tableData[index].FACT_VALUE;
      }
      tableData[index].RESULT = Taxes.getResult(tableData[index]);
      tableData[index].measure_unit_name = measure_unit_name;

      this.setState({ tableData });
      this.props.onChange(tableData);
    }
  };

  addOperation = () => {
    const { tableData } = this.state;
    const { correctionRate, baseFactValue, errorsAll } = this.props;
    const overallValue = +Taxes.calculateFinalFactValue(this.state.tableData);

    const value
      = baseFactValue || baseFactValue === 0
        ? (baseFactValue - overallValue)
        : null;
    tableData.push({
      fuel_correction_rate: correctionRate,
      FACT_VALUE: value,
      OPERATION: null,
    });
    this.setState({ tableData, errorsAll });
    this.props.onChange(tableData);
  };

  removeOperation = () => {
    const { tableData } = this.state;
    tableData.splice(this.state.selectedOperation, 1);
    this.setState({ tableData });
    this.props.onChange(tableData);
  };

  selectOperation = (selectedOperation) => {
    this.setState({ selectedOperation });
  };

  render() {
    const {
      taxes = this.state.tableData,
      fuelRates = [],
      title = 'Расчет топлива по норме',
      hidden,
      noDataMessage = 'Для данного ТС нормы расхода топлива не указаны',
      baseFactValue,
    } = this.props;
    const hasTaxes = taxes.length > 0;
    const finalResult = Taxes.calculateFinalResult(taxes);
    const finalFactValue = Taxes.calculateFinalFactValue(taxes);
    const finalFactValueEqualsBaseValue
      = parseFloat(baseFactValue).toFixed(3).replace('.', ',')
      === parseFloat(finalFactValue.toString()).toFixed(3).replace('.', ',');

    return (
      <TaxiCalcBlock hidden={hidden}>
        <HrLineWaybill />
        <EtsBootstrap.Row>
          <EtsHeaderContainerWrap>
            <EtsHeaderContainer>
              <EtsHeaderTitle>{title}</EtsHeaderTitle>
              <EtsButtonsContainer>
                {!this.props.readOnly && (
                  <React.Fragment>
                    <ButtonTableInput
                      width={160}
                      id="taxes-add-operation"
                      block
                      onClick={this.addOperation}
                      disabled={this.state.operations.length === taxes.length}>
                      Добавить операцию
                    </ButtonTableInput>
                    <ButtonTableInput
                      width={160}
                      id="remove-operation"
                      block
                      disabled={
                        this.state.selectedOperation === null
                        || taxes.length === 0
                      }
                      onClick={this.removeOperation}>
                      Удалить операцию
                    </ButtonTableInput>
                  </React.Fragment>
                )}
              </EtsButtonsContainer>
            </EtsHeaderContainer>
          </EtsHeaderContainerWrap>
        </EtsBootstrap.Row>
        {!(fuelRates.length || !!hasTaxes) && <h5>{noDataMessage}</h5>}
        <Div hidden={!hasTaxes}>
          <Table
            id={'tax_data'}
            title="Расчет топлива по норме"
            columnCaptions={this.tableCaptions}
            data={taxes}
            tableCols={this.tableCols}
            pageSize={10}
            cellRenderers={this.tableCellRenderers}
            onRowSelected={
              !this.props.readOnly ? this.selectOperation : undefined
            }
          />
        </Div>
        {Boolean(hasTaxes) && (
          <FooterEnd margin={30}>
            <div>
              <b>{'Итого '}</b>
            </div>
            <div>
              <b>
                {!finalFactValueEqualsBaseValue ? (
                  <SpanRed>{finalFactValue.toFixed(3).replace('.', ',')}</SpanRed>
                ) : (
                  <SpanGreen>{finalFactValue.toFixed(3).replace('.', ',')}</SpanGreen>
                )}
                <span> (км | м/ч)</span>
              </b>
            </div>
            <div>
              <b>{finalResult.toFixed(3).replace('.', ',')} л</b>
            </div>
          </FooterEnd>
        )}
      </TaxiCalcBlock>
    );
  }
}
