import * as React from 'react';
import * as PropTypes from 'prop-types';
import Table from 'components/old/waybill/Table';

import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';

import Div from 'components/old/ui/Div';
import { isEmpty } from 'utils/functions';
import { get } from 'lodash';
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
import { TaxiCalcBlock } from './Taxes';
import { HrLineWaybill } from 'components/new/pages/login/styled/styled';
import { ErrorField } from 'components/@next/@ui/renderFields/ErrorsBlock/styled/ErrorField';

/**
 * Компонент таксировки ТС
 * @extends React.Component
 */
export default class EquipmentTaxes extends React.Component<any, any> {
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
      isElectricalKind: PropTypes.bool,
    };
  }

  static getResult({ FACT_VALUE, FUEL_RATE }) {
    if (isEmpty(FACT_VALUE) || isEmpty(FUEL_RATE)) {
      return 0;
    }
    return FUEL_RATE * FACT_VALUE;
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

  static calculateFinalFactValue(data, type) {
    if (!data || (data && !data.length)) {
      return {
        withMileage: 0,
        withoutMileage: 0,
      };
    }
    const result = data.reduce(
      (res, cur) => {
        if (!isEmpty(cur.FACT_VALUE) && !cur.is_excluding_mileage) {
          if (
            !cur.measure_unit_name
            || (type === 'motohours' && cur.measure_unit_name === 'л/моточас')
            || (type === 'odometr' && cur.measure_unit_name === 'л/км')
          ) {
            res.withMileage += parseFloat(cur.FACT_VALUE); // eslint-disable-line
          } else {
            res.withoutMileage += parseFloat(cur.FACT_VALUE);
          }
        }
        return res;
      },
      {
        withMileage: 0,
        withoutMileage: 0,
      },
    );
    return result;
  }

  tableCaptions: Array<any>;
  tableCols: Array<string>;
  tableCellRenderers: Record<string, any>;

  constructor(props) {
    super(props);

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
        value: `Значение (км | м/ч | раз | час)`,
        width: 150,
      },
      {
        value: `Результат ${props.isElectricalKind ? 'кВт' : '(л)'}`,
        width: 125,
      },
    ];

    this.tableCols = [
      'OPERATION',
      'measure_unit_name',
      'FUEL_RATE',
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

        const errors = get(this.state, 'errorsAll.equipment_tax_data_rows', []);
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
        const errors = get(this.state, 'errorsAll.equipment_tax_data_rows', []);
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
      errorsAll: {},
      totalValueError: '',
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

    taxes.map((tax) => ({ ...tax, RESULT: EquipmentTaxes.getResult(tax) }));

    return { operations, fuelRates, tableData: taxes, errorsAll };
  }

  componentDidUpdate() {
    const {
      taxes = this.state.tableData,
      baseFactValue,
      type,
      setTotalValueError,
    } = this.props;
    const hasTaxes = taxes.length > 0;
    const finalFactValue = EquipmentTaxes.calculateFinalFactValue(taxes, type).withMileage;
    const finalFactValueMoreOrEqualBaseValue
      = Number(baseFactValue) <= Number(finalFactValue);
    const error = !finalFactValueMoreOrEqualBaseValue ? 'Значение в поле "Итого" должно быть не меньше пробега оборудования' : ''; 

    if (this.state.totalValueError !== error && hasTaxes) {
      this.setState({totalValueError: error});
      setTotalValueError('equipmentTaxesTotalValueError', Boolean(error));
    }
  }

  handleFactValueChange = (index, e) => {
    const { tableData } = this.state;
    const current = tableData[index];
    const oldCurrVal = current.FACT_VALUE;
    current.FACT_VALUE = e.target.value === '' || e.target.value <= 0 ? '' : Math.abs(e.target.value);

    const threeSybolsAfterComma = /^([0-9]{1,})\.([0-9]{4,})$/.test(
      current.FACT_VALUE,
    ); // есть 3 знака после запятой
    if (
      current.is_excluding_mileage
      && current.measure_unit_name === 'л/подъем'
      && current.FACT_VALUE !== ''
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

    current.RESULT = EquipmentTaxes.getResult(current);
    this.setState({ tableData });
    this.props.onChange(tableData, 'equipment_taxes_fact_value', index);
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
        tableData[index].FACT_VALUE = null;
      } else if (last_is_excluding_mileage) {
        tableData[index].FACT_VALUE
          = tableData[index].iem_FACT_VALUE || tableData[index].FACT_VALUE;
      }
      tableData[index].RESULT = EquipmentTaxes.getResult(tableData[index]);
      tableData[index].measure_unit_name = measure_unit_name;

      this.setState({ tableData });
      this.props.onChange(tableData, 'equipment_taxes_operation', index);
    }
  };

  addOperation = () => {
    const { tableData } = this.state;
    const { errorsAll } = this.props;

    tableData.push({
      FACT_VALUE: null,
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
      type,
      baseFactValue,
    } = this.props;
    const hasTaxes = taxes.length > 0;
    const finalResult = EquipmentTaxes.calculateFinalResult(taxes);
    const finalFactValue = EquipmentTaxes.calculateFinalFactValue(taxes, type).withMileage;
    const finalFactValueWithoutMileage = EquipmentTaxes.calculateFinalFactValue(taxes, type).withoutMileage;
    const finalFactValueEqualBaseValue
    = Number(baseFactValue) === Number(finalFactValue);

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
                      id="equipment-taxes-add-operation"
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
            id={'e_tax_data'}
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
            <ErrorField>
              {this.state.totalValueError}
            </ErrorField>
            <div>
              <div>
                <b>{'Итого '}</b>
              </div>
              <div> {finalFactValueWithoutMileage ? <b>{'Без учета пробега '}</b> : ''} </div>
            </div>
            <div>
              <div>
                <b>
                  {!finalFactValueEqualBaseValue ? (
                    <SpanRed>{finalFactValue.toFixed(3).replace('.', ',')}</SpanRed>
                  ) : (
                    <SpanGreen>{finalFactValue.toFixed(3).replace('.', ',')}</SpanGreen>
                  )}
                  <span> {type === 'motohours' ? 'м/ч' : 'км'} </span>
                </b>
                <div>
                  {finalFactValueWithoutMileage
                    ? <b>
                      <SpanGreen>{finalFactValueWithoutMileage.toFixed(3).replace('.', ',')}</SpanGreen>
                      <span> {type !== 'motohours' ? 'м/ч' : 'км'} </span>
                    </b>
                    : ''
                  }
                </div>
              </div>
            </div>
            <div>
              <b>{finalResult.toFixed(3).replace('.', ',')} {this.props.isElectricalKind ? 'кВт' : 'л'}</b>
            </div>
          </FooterEnd>
        )}
      </TaxiCalcBlock>
    );
  }
}
