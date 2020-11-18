import * as React from 'react';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import { isArray } from 'util';

import Div from 'components/old/ui/Div';
import FilterInput from 'components/old/ui/input/FilterInput/FilterInput';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';
import { ColFilter } from 'components/old/ui/tableNew/filter/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type Props = {
  [k: string]: any;
};

class FilterRow extends React.Component<Props, {}> {
  static get propTypes() {
    return {
      value: PropTypes.any,
      type: PropTypes.string,
      labelFunction: PropTypes.func,
      availableOptions: PropTypes.array,
      tableData: PropTypes.array,
      name: PropTypes.string,
      byLabel: PropTypes.string,
      displayName: PropTypes.string,
      onChange: PropTypes.func,
      onMultiChange: PropTypes.func,
      entity: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      labelFunction: (v) => typeof v === 'number' ? v.toString().replace('.', ',') : v,
      tableData: [],
    };
  }

  // TODO добавить в FilterInput type и поддержку select
  render() {
    const {
      availableOptions,
      byLabel = '',
      displayName,
      labelFunction,
      name,
      tableData,
      onChange,
      onMultiChange,
      type,
      entity,
    } = this.props;
    let { value } = this.props;

    const idValue = name
      ? `${entity ? `${entity}-` : ''}${name}-value`
      : undefined;
    const idLabel = name
      ? `${entity ? `${entity}-` : ''}${name}-label`
      : undefined;

    let input = (
      <div className="form-group">
        <EtsBootstrap.FormControl
          id={idValue}
          type="text"
          value={value || ''}
          onChange={onChange}
        />
      </div>
    );

    if (type) {
      if (type === 'multiselect') {
        let options = availableOptions;
        let tableDataForOption = tableData || [];

        if (!options || !options.length) {
          const deepArr = tableDataForOption.some(({ rows }) => isArray(rows));
          if (deepArr) {
            tableDataForOption = tableDataForOption.reduce(
              (newArr, { rows }) => {
                newArr.push(...rows);

                return newArr;
              },
              [],
            );
          }

          if (tableDataForOption[0] && isArray(tableDataForOption[0][name])) {
            const reducedTableDataOptions = tableDataForOption
              .reduce((newArr, currentArr) => {
                newArr.push(currentArr[name]);
                return newArr;
              }, [])
              .flat();
            options = _(reducedTableDataOptions)
              .uniqBy('id')
              .map((d) => ({
                value: d.id,
                label: labelFunction(d.name),
              }))
              .filter((d) => d.label && d.label !== '0')
              .value();
          } else {
            options = _(tableDataForOption)
              .uniqBy(name)
              .map((d) => ({
                value: typeof d[name] === 'boolean' ? +d[name] : d[name],
                label: labelFunction(d[byLabel || name]),
              }))
              .filter((d) => d.label && d.label !== '0')
              .value();
          }
        }

        if (options.length && Array.isArray(options[0].value)) {
          options = options.reduce((newOptions, option) => {
            const arrOpt = option.value.map((element, index) => {
              return {
                value: element,
                label: option.label[index],
              };
            });
            newOptions.push(...arrOpt);
            return newOptions;
          }, []);
          options = _.uniqBy(options, 'value');
        }

        if (type === 'multiselect') {
          if (value && !!value.length) {
            value = value.filter((v) => _.find(options, (o) => o.value === v));
          }

          input = (
            <Div className="filter-multiselect-container">
              <ReactSelect
                modalKey={entity}
                id={name}
                options={options}
                multi
                delimiter={'$'}
                value={value}
                onChange={onMultiChange}
              />
            </Div>
          );
        }
      }
      if (type === 'advanced-number') {
        input = (
          <FilterInput
            entity={entity}
            filterValue={value}
            fieldName={name}
            inputType="number"
            onChange={onChange}
            lang="en"
          />
        );
      }
      if (type === 'advanced-date' || type === 'advanced-datetime' ) {
        input = (
          <FilterInput
            entity={entity}
            filterValue={value}
            fieldName={name}
            inputType={type} // 'advanced-date' || 'advanced-datetime'
            onChange={onChange}
          />
        );
      }
      if (type === 'date') {
        input = (
          <FilterInput
            entity={entity}
            filterValue={value}
            fieldName={name}
            inputType="date"
            onChange={onChange}
            single
          />
        );
      }
      if (type === 'datetime') {
        input = (
          <FilterInput
            entity={entity}
            filterValue={value}
            fieldName={name}
            inputType="datetime"
            onChange={onChange}
            single
          />
        );
      }
    }

    return (
      <ColFilter lg={3} md={4} sm={6}>
        <label id={idLabel} htmlFor="input">
          {displayName}
        </label>
        {input}
      </ColFilter>
    );
  }
}

export default FilterRow;
