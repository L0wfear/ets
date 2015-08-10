import React, { Component } from 'react';
import { DropdownList, Multiselect } from 'react-widgets';

let filter_width = '160px';

function filter(item, search) {
  if (!item || !item.title) {
    return false;
  }

  var title = item.title.toLowerCase();
  search = search.toLowerCase();

  return title.indexOf(search) !== -1;
}

var messages = {
  open: 'открыть',
  emptyList:   "",
  emptyFilter: "Ничего не найдено"
}


/*
class CheckboxListComponent extends Component {

  render() {
    const item = this.props.item;
    const checked = false;

    return (
      <span className="list-item-checkbox">
        <input type="checkbox" name="" checked={checked}/>
        {item.title}
      </span>
    );
  }

}
*/


class Filter extends Component {

  constructor(props, context) {
    super()
    this.state = { flux: context.flux };
  }

  render() {
    let options = this.props.options;

    if (this.props.search === undefined) {
      return this.renderSimpleInput(options)
    }
    if (this.props.search) {
      return this.renderSearch(options);
    }

    return (
      <div className="app-toolbar-filter">
        <span className="title">{this.props.title}</span>
        <DropdownList valueField="id"
                      textField="title"
                      defaultValue={null}
                      data={options}
                      onChange={(value) => this.onChangeSingle(value)}
                      {...this.props}/>
      </div>
    );
  }

  renderSearch(options) {
    return (
        <div className="app-toolbar-filter">
          <Multiselect valueField="id"
                        textField="title"
                        defaultValue={[]}
                        data={options}
                        onChange={(value) => this.onChange(value)}
                        filter={filter}
                        messages={messages}
                        placeholder={this.props.title}
                        /*itemComponent={CheckboxListComponent}
                        valueComponent={CheckboxListComponent}*/
                        {...this.props}/>
        </div>
    );
  }

  renderSimpleInput( options ) {

    return (
      <div>
        <input valueField="id"
               textField="title"
               defaultValue={[]}
               placeholder={this.props.title}
               onChange={(value) => this.onChangeQuery.bind(this)(value)}
               filter={filter}
               messages={messages}
          {...this.props}/>
      </div>
    )
  }

  onChange(value) {
    this.state.flux.getActions('points').setFilter({
      [this.props.name]: value.map( i => i.id )
    });
  }

  onChangeSingle(value) {
    this.state.flux.getActions('points').setFilter({
      [this.props.name]: value.id
    });
  }

  onChangeQuery(value) {
    let val = value.currentTarget.value;

    this.state.flux.getActions('points').setFilter({
      [this.props.name]: val
    })
  }

}

Filter.contextTypes = {
  flux: React.PropTypes.object.isRequired
}

export default Filter;
