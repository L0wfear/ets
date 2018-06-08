import React, { Component, PropTypes } from 'react';
// replace here
// import { DropdownList, Multiselect } from 'react-widgets';

function filter(item, search) {
  if (!item || !item.title) {
    return false;
  }

  const title = item.title.toLowerCase();
  search = search.toLowerCase();

  return title.indexOf(search) !== -1;
}

const messages = {
  open: 'открыть',
  emptyList: '',
  emptyFilter: 'Ничего не найдено',
};


export default class Filter extends Component {

  static get propTypes() {
    return {
      title: PropTypes.string,
      name: PropTypes.string,
      onFilterChange: PropTypes.func,
      search: PropTypes.bool,
      options: PropTypes.arrayOf(PropTypes.object),
      valueField: PropTypes.string,
    };
  }

  static get contextTypes() {
    return {
      flux: PropTypes.object,
    };
  }

  static get defaultProps() {
    return {
      valueField: 'id',
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = { flux: context.flux };
    this.store = context.flux.getStore('points');
  }

  onSomethingChange(value) {
    const callback =
      this.props.onFilterChange !== undefined ?
        () => { this.props.onFilterChange(value); }
        :
        () => {};

    this.store.handleSetFilter({
      [this.props.name]: value,
    }, callback);
  }

  onChange(value) {
    value = value.map(i => i[this.props.valueField]);
    this.onSomethingChange(value);
  }

  onChangeSingle(value) {
    value = value.id;
    this.onSomethingChange(value);
  }

  onChangeQuery(value) {
    value = value.currentTarget.value;
    this.onSomethingChange(value);
  }

  renderSearch(options) {
    return (
      <div className="app-toolbar-filter">
      {
        /*
        <Multiselect
        valueField={this.props.valueField}
        textField="title"
        defaultValue={[]}
        data={options}
        onChange={value => this.onChange(value)}
        filter={filter}
        messages={messages}
        placeholder={this.props.title}
        className="map-filter__input"
        {...this.props}
        />
        */
        }
      </div>
    );
  }

  renderSimpleInput() {
    return (
      <div>
        <input
          valueField={this.props.valueField}
          textField="title"
          defaultValue={[]}
          placeholder={this.props.title}
          onChange={value => this.onChangeQuery(value)}
          filter={filter}
          messages={messages}
          {...this.props}
        />
      </div>
    );
  }

  render() {
    const options = this.props.options;

    if (this.props.search === undefined) {
      return this.renderSimpleInput(options);
    }
    if (this.props.search) {
      return this.renderSearch(options);
    }
    return (
      <div className="app-toolbar-filter">
        <span className="title">{this.props.title}</span>
        {
          /*
          <DropdownList
          valueField={this.props.valueField}
          textField="title"
          defaultValue={null}
          data={options}
          onChange={value => this.onChangeSingle(value)}
          {...this.props}
          />
          */
        }
      </div>
    );
  }

}
