import React, { Component } from 'react';
import { DropdownList, Multiselect } from 'react-widgets';

var filter_width = '160px';

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

class Filter extends Component {

  constructor(props, context) {
    this.state = { flux: context.flux };
  }

  render() {
    let options = this.props.options;

    if (this.props.search) {
      return this.renderSearch(options);
    }

    return (
      <div className="col-xs-2" style={{width: filter_width, display: 'inline-block'}}>
        <div className="tool coordinates">
          <h5>{this.props.title}</h5>

          <DropdownList valueField="id"
                        textField="title"
                        defaultValue={null}
                        data={options}
                        onChange={(value) => this.onChangeSingle(value)}
                        {...this.props}/>
        </div>
      </div>
    );
  }

  renderSearch(options) {
    return (
      <div className="col-xs-2"  style={{width: filter_width, display: 'inline-block'}}>
        <div className="">
          <h5>{this.props.title}</h5>

          <Multiselect valueField="id"
                        textField="title"
                        defaultValue={[]}
                        data={options}
                        onChange={(value) => this.onChange(value)}
                        filter={filter}
                        messages={messages}
                        {...this.props}/>
        </div>
      </div>
    );
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

}

Filter.contextTypes = {
  flux: React.PropTypes.object.isRequired
}

export default Filter;
