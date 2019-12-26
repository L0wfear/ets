import * as React from 'react';
import * as PropTypes from 'prop-types';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import { isEmpty } from 'utils/functions';
import { reduce, cloneDeep } from 'lodash';
import Div from 'components/old/ui/Div';
import FilterRow from 'components/old/ui/table/filter/FilterRow';
import { FilterRowsContainerDataTable } from 'components/new/ui/styled/Bootstrap3Features';
import {
  EtsFiltersButtonsLine,
  EtsFiltersCloseContainer,
  EtsFilterActionButton,
  EtsFilterActionButtonConteiner,
} from 'components/new/ui/registry/components/data/filters/buttons-line/styled/styled';

type Props = {
  [k: string]: any;
};
type State = {
  [k: string]: any;
};

export default class Filter extends React.Component<Props, State> {
  static get propTypes() {
    return {
      values: PropTypes.object,
      show: PropTypes.bool,
      tableData: PropTypes.array,
      onHide: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
      options: PropTypes.array,
      entity: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      alreadyShow: props.show,
      propsFilterValues: props.values,
      filterValues: props.values || {},
    };
  }

  componentDidMount() {
    if (this.props.show) {
      if (this.props.loadDependecyData) {
        this.props.loadDependecyData();
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { alreadyShow } = this.state;
    const { show } = this.props;

    if (show && show !== prevProps.show && !alreadyShow) {
      if (this.props.loadDependecyData) {
        this.props.loadDependecyData();
      }
      this.setState({ alreadyShow: true });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { values } = nextProps;

    if (prevState.propsFilterValues !== values) {
      return {
        propsFilterValues: values,
        filterValues: values,
      };
    }

    return null;
  }

  // TODO сделано для adv...-select-like
  // из-за с проблем с именем
  // переделать
  getName = (name, type) => {
    switch (type) {
      default:
        return name;
    }
  };

  handleFilterValueChange = (key, e) => {
    const {
      filterValues: { ...filterValues },
    } = this.state;

    if (!e || isEmpty(e.target ? e.target.value : e)) {
      delete filterValues[key];
    } else {
      const data = e.target ? e.target.value : e;
      const { filter } = this.props.options.find(({ name }) =>
        key.match(`^${name}`),
      );

      filterValues[key] = {
        type: filter.type || 'text',
        value: data,
      };
    }

    this.setState({ filterValues });
  };

  submit = (event) => {
    event.preventDefault();

    const filterValues = reduce(
      this.state.filterValues,
      (cur, v, k) => {
        if (typeof v !== 'undefined') {
          if (typeof v === 'string') {
            if (v.length > 0) {
              cur[k] = v;
            }
          } else {
            cur[k] = v;
          }
        }
        return cur;
      },
      {},
    );
    this.props.onSubmit(filterValues);
  };

  reset = () => this.props.onSubmit({});

  checkDisabledButton = (filterValues) =>
    Object.keys(filterValues).length === 0;

  handleFilterMultipleValueChange(key, v) {
    const { filterValues: oldFilterValues } = this.state;

    const filterValues = cloneDeep(oldFilterValues);
    const data = !isEmpty(v) ? v : [];
    const { filter } = this.props.options.find(({ name }) =>
      key.match(`^${name}`),
    );

    // для формата под новую таблицу
    filterValues[key] = {
      type: filter.type || '',
      value: data,
    };

    if (data.length === 0) {
      delete filterValues[key];
    }

    this.setState({ filterValues });
  }

  render() {
    const { filterValues } = this.state;
    const { tableData, options: filters } = this.props;

    const filterRows = filters.map((option, i) => {
      const { filter = {}, name, displayName } = option;
      const { type, labelFunction, options, byKey, byLabel } = filter;

      return (
        <FilterRow
          reportKey={this.props.reportKey}
          tableData={tableData}
          entity={this.props.entity}
          key={i}
          value={(filterValues[this.getName(byKey || name, type)] || {}).value}
          type={type}
          name={this.getName(byKey || name, type)}
          byLabel={byLabel}
          serverFieldName={filter.serverFieldName}
          labelFunction={labelFunction}
          availableOptions={options}
          displayName={displayName}
          onChange={(event) =>
            this.handleFilterValueChange(
              this.getName(byKey || name, type),
              event,
            )
          }
          onMultiChange={(event) =>
            this.handleFilterMultipleValueChange(
              this.getName(byKey || name, type),
              event,
            )
          }
        />
      );
    });

    return (
      <form onSubmit={this.submit}>
        <EtsBootstrap.Collapse in={this.props.show}>
          <Div className="filter-container">
            <Div className="filter-buttons">
              <EtsFiltersButtonsLine>
                <div />
                <EtsFilterActionButtonConteiner>
                  <EtsFilterActionButton id="submit" type="submit">
                    Применить
                  </EtsFilterActionButton>
                  <EtsFilterActionButton
                    id="reset-filter"
                    onClick={this.reset}
                    disabled={this.checkDisabledButton(filterValues)}>
                    Сброс
                  </EtsFilterActionButton>
                </EtsFilterActionButtonConteiner>
                <EtsFiltersCloseContainer onClick={this.props.onHide}>
                  <EtsBootstrap.Glyphicon glyph="remove" />
                </EtsFiltersCloseContainer>
              </EtsFiltersButtonsLine>
            </Div>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <FilterRowsContainerDataTable>
                  {filterRows}
                </FilterRowsContainerDataTable>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </Div>
        </EtsBootstrap.Collapse>
      </form>
    );
  }
}
