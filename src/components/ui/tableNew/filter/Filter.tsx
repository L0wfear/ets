import * as React from 'react';
import { get } from 'lodash';
import Div from 'components/ui/Div.jsx';
import { Button, Glyphicon, Collapse } from 'react-bootstrap';
import { isEmpty } from 'utils/functions';
import FilterRow from './FilterRow.jsx';
const FilterRowTSX: any = FilterRow;

class Fiter extends React.Component<any, any> {
  state = {
    filterValues: {},
  };
  componentWillReceiveProps(props) {
    this.setState({ filterValues: props.filterValues });
  }

  handleFilterValueChange = (key, type, e) => {
    const filterValues = { ...this.state.filterValues };

    if (!e || isEmpty(e.target ? e.target.value : e)) {
      delete filterValues[key];
    } else {
      filterValues[key] = {
        value: e.target ? e.target.value : e,
        type,
      }
    }

    this.setState({ filterValues });
  }

  handleFilterMultipleValueChange = (key, type, v) => {
    const filterValues = { ...this.state.filterValues };
    const data = !isEmpty(v) ? v : [];

    if (data.length === 0) {
      delete filterValues[key];
    } else {
      filterValues[key] = {
        value: data,
        type,
      };
    }

    this.setState({ filterValues });
  }

  getName(name, type) {
    switch (type) {
      case 'advanced-select-like': return `${name}__like`;
      default: return name;
    }
  }

  submit = () => this.props.onSubmit(this.state.filterValues);
  reset = () => this.props.onSubmit({});

  renderFilterRow = col => {
    const {
      name,
      filter,
      filter: {
        type,
        notUse,
      },
    } = col;
    
    const customName = this.getName(filter.byKey || name, type);

    return !notUse && (
      <FilterRowTSX
        key={name}
        data={this.props.data}
        value={get(this.state.filterValues, [customName, 'value'], null)}
        type={type}
        name={customName}
        byLabel={filter.byLabel}
        serverFieldName={filter.serverFieldName}
        labelFunction={filter.labelFunction}
        availableOptions={filter.options}
        displayName={col.displayName}
        onChange={this.handleFilterValueChange}
        onMultiChange={this.handleFilterMultipleValueChange}
      />
    );
  }

  render() {
    return (
      <Collapse in={this.props.show}>
        <Div className="filter-container">
          <Div className="filter-buttons">
            <Button onClick={this.submit}>Применить</Button>
            <Button onClick={this.reset} disabled={!this.props.haveActiveFilter}>Сброс</Button>
            <span className="filter-close" onClick={this.props.toggleFilter}><Glyphicon glyph="remove" /></span>
          </Div>
          {
            this.props.tableMeta.cols.map(this.renderFilterRow)
          }
        </Div>
      </Collapse>
    )
  }
}

export default Fiter;
