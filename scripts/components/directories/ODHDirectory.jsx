import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import FormWrap from '../ui/form/FormWrap.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';
import connectToStores from 'flummox/connect';

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
        caption: <span style={{wordWrap: 'break-word'}}>Площадь механизированной уборки</span>,
        type: 'number',
      },
      {
        name: 'manual_footway_area',
        caption: 'Площадь ручной уборки',
        type: 'number',
      },
      {
        name: 'snow_area',
        caption: 'Полощадь уборки снега',
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
    distance: ({data}) => <div>{data.toString() + ' м'}</div>,
    roadway_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    footway_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    cleaning_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    auto_footway_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    manual_footway_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    snow_area: ({data}) => <div>{data.toString() + ' кв.м'}</div>,
    gutters_length: ({data}) => <div>{data.toString() + ' м'}</div>
  };

  return <Table title="Реестр ОДХ"
    results={props.data}
    tableMeta={getTableMeta(props)}
    renderers={renderers}
    initialSort={'name'}
    {...props}/>;
};

class ODHDirectory extends Component {


  constructor(props) {
    super(props);

    this.state = {
      selectedODH: null,
      filterModalIsOpen: false,
      filterValues: {},
      showForm: false,
    };
  }

  selectODH({props}) {
    const id = props.data.id;
    let selectedODH = _.find(this.props.ODHsList, to => to.id === id) || null;
    this.setState({selectedODH});
  }


  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getODHs();
  }

  render() {
    const { odhsList = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <ODHTable data={odhsList} onRowSelected={this.selectODH.bind(this)} selected={this.state.selectedODH} selectField={'id'} {...this.props}>
          <Button bsSize="small" onClick={() => this.setState({ showForm: true })} disabled={this.state.selectedODH === null}> Просмотреть</Button>
        </ODHTable>
        <FormWrap tableMeta={getTableMeta(this.props)}
          showForm={this.state.showForm}
          onFormHide={() => this.setState({showForm: false})}
          element={this.state.selectedODH}
          title={'ОДХ'} />
      </div>
  );
  }
}

ODHDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

const Wrapped = connectToStores(ODHDirectory, ['objects']);

export default Wrapped;
