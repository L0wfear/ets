import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import ElementsList from '../ElementsList.jsx';
import OdhFormWrap from './odh/OdhFormWrap.jsx';

let getTableMeta = (props) => {
  let tableMeta = {
    cols: [
      {
        name: 'name',
        caption: 'Название',
        type: 'string',
        filter: {
          type: 'select',
        },
        form: {
          required: true,
          editable: false,
          formType: 'select'
        }
      },
      {
        name: 'total_area',
        caption: 'Общая площадь',
        type: 'number',
      },
      {
        name: 'distance',
        caption: 'Протяженность',
        type: 'number',
      },
      {
        name: 'roadway_area',
        caption: 'Площадь дорожного полотна',
        type: 'number',
      },
      {
        name: 'footway_area',
        caption: 'Площадь тротуаров',
        type: 'number',
      },
      {
        name: 'cleaning_area',
        caption: 'Площадь уборки',
        type: 'number',
      },
      {
        name: 'auto_footway_area',
        caption: 'Площадь механизированной уборки тротуаров',
        type: 'number',
      },
      {
        name: 'manual_footway_area',
        caption: 'Площадь ручной уборки тротуаров',
        type: 'number',
      },
      {
        name: 'snow_area',
        caption: 'Площадь уборки снега',
        type: 'number',
      },
      {
        name: 'gutters_length',
        caption: 'Протяженность лотков',
        type: 'number',
      }
    ]
  };
  return tableMeta;
};



let ODHTable = (props) => {

  const renderers = {
    name: ({data}) => <div>{data.toString()}</div>,
    total_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    distance: ({data}) => <div>{data.toString() + ' п.м'}</div>,
    roadway_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    footway_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    cleaning_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    auto_footway_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    manual_footway_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    snow_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    gutters_length: ({data}) => <div>{data.toString() + ' п.м'}</div>
  };

  return <Table title="Реестр ОДХ"
                results={props.data}
                tableMeta={getTableMeta(props)}
                renderers={renderers}
                initialSort={'name'}
                {...props}/>;
};

class ODHDirectory extends ElementsList {


  constructor(props) {
    super(props);
    this.mainListName = 'odhsList';
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('objects').getODHs();
  }

  render() {
    const { odhsList = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <ODHTable data={odhsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'} {...this.props}>
          <Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}> Просмотреть</Button>
        </ODHTable>
        <OdhFormWrap onFormHide={this.onFormHide.bind(this)}
										 showForm={this.state.showForm}
										 element={this.state.selectedElement}
										 {...this.props}/>
      </div>
  );
  }
}

ODHDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(ODHDirectory, ['objects']);
