import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import ElementsList from '../ElementsList.jsx';
import DtFormWrap from './dt/DtFormWrap.jsx';

let getTableMeta = (props) => {
  let tableMeta = {
    cols: [
      {
        name: 'object_address',
        caption: 'Название ДТ',
        type: 'string',
        filter: {
          type: 'select',
        }
      },
      {
        name: 'total_area',
        caption: 'Общая площадь',
        type: 'number',
      },
      {
        name: 'clean_area',
        caption: 'Общая уборочная площадь',
        type: 'number',
      },
      {
        name: 'auto_area',
        caption: 'Площадь механизированной уборки',
        type: 'number',
      },
      {
        name: 'company_structure_name',
        caption: 'Подразделение',
        type: 'text',
      },
    ]
  };
  return tableMeta;
};



let DTTable = (props) => {

  const renderers = {
    clean_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    total_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    auto_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
  };

  return <Table title="Реестр ДТ"
      results={props.data}
      tableMeta={getTableMeta(props)}
      renderers={renderers}
      initialSort={'name'}
      {...props}/>;
};

class DTDirectory extends ElementsList {


  constructor(props) {
    super(props);
    this.mainListName = 'dtsList';
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('objects').getDTs();
  }

  render() {
    const { dtsList = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <DTTable data={dtsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'} {...this.props}>
          <Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}> Просмотреть</Button>
        </DTTable>
        <DtFormWrap onFormHide={this.onFormHide.bind(this)}
                    showForm={this.state.showForm}
										element={this.state.selectedElement}
										 {...this.props}/>
      </div>
  );
  }
}

DTDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(DTDirectory, ['objects']);
