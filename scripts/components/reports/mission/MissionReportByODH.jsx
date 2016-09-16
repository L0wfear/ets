import React, { Component, PropTypes } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import ElementsList from 'components/ElementsList.jsx';

const getTableMeta = (props) => {
  const tableMeta = {
    cols: [
      {
        name: 'odh_name',
        displayName: 'ОДХ',
        type: 'string',
        filter: {
          type: 'select',
        },
      },
      {
        name: 'route_check_value',
        displayName: `Нужно пройти (${props.data[0].route_check_unit})`,
        type: 'string',
        filter: false,
      },
      {
        name: 'traveled',
        displayName: `Пройдено в рабочем режиме (${props.data[0].route_check_unit})*`,
        type: 'string',
        filter: false,
      },
      {
        name: 'left',
        displayName: `Осталось (${props.data[0].route_check_unit})`,
        type: 'string',
        filter: false,
      },
      {
        name: 'left_percentage',
        displayName: 'Осталось %',
        type: 'string',
        filter: false,
      },
      {
        name: 'v_avg_max',
        displayName: 'Максимальная скорость',
        type: 'string',
        filter: false,
      },
      {
        name: 'route_with_speed',
        displayName: 'Контроль (км.)**',
        type: 'string',
        filter: false,
      },
      {
        name: 'route_check_unit',
        displayName: 'Единица измерения',
        type: 'string',
        display: props.data && props.data[0] && props.data[0].route_check_unit,
        filter: {
          type: 'select',
        },
      },
    ],
  };

  return tableMeta;
};


const MissionReportByODHTable = (props) => {
  const tableMeta = getTableMeta(props);

  const renderers = {
    left_percentage: ({ data }) => <div>{ parseFloat(parseFloat(data) * 100).toFixed(2) + '%'}</div>,
    traveled_percentage: ({ data }) => <div>{ parseFloat(parseFloat(data) * 100).toFixed(2) + '%'}</div>,
    left: meta => <div>{ parseFloat(meta.data).toFixed(2) + ' ' + meta.rowData.route_check_unit }</div>,
    traveled: meta => <div>{ parseFloat(meta.data).toFixed(2) + ' ' + meta.rowData.route_check_unit }</div>,
    route_check_length: ({ data }) => <div>{ data }</div>,
    route_check_value: meta => <div>{ meta.data + ' ' + meta.rowData.route_check_unit }</div>,
  };

  if (props.renderOnly) {
    const hiddenFields = ['left_percentage', 'v_avg_max',
      'traveled_percentage', 'route_check_unit'];
    tableMeta.cols = tableMeta.cols.filter(c => hiddenFields.indexOf(c.name) === -1);
    delete renderers.left_percentage;
    delete renderers.traveled_percentage;
    renderers.left = data => <div>
      {parseFloat(data.data).toFixed(2) + ' ' + data.rowData.route_check_unit}
      <br />
      {`(${parseFloat(parseFloat(data.rowData.left_percentage) * 100).toFixed(0) + '%'})`}
    </div>;
    renderers.traveled = data => <div>
      {parseFloat(data.data).toFixed(2) + ' ' + data.rowData.route_check_unit}
      <br />
      {`(${parseFloat(parseFloat(data.rowData.traveled_percentage) * 100).toFixed(0) + '%'})`}
    </div>;
  } else {
    tableMeta.cols = tableMeta.cols.filter(c => c.name !== 'route_with_speed');
  }

  return (
    <Table
      title="Прохождение заданий по ОДХ"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      {...props}
    />
  );
};

class MissionReportByODH extends ElementsList {

  static propTypes = {
    renderOnly: PropTypes.bool,
    onElementChange: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.selectField = 'odh_id';
    this.mainListName = 'selectedReportDataODHS';
  }

  async componentDidMount() {
    if (!this.props.renderOnly) {
      await this.context.flux.getActions('missions').getMissionReportById(this.props.routeParams.id);
      this.context.flux.getActions('missions').getMissionReportByODHs(this.props.routeParams.index);
    }
  }

  selectElement(el) {
    super.selectElement(el);
    if (typeof this.props.onElementChange === 'function') {
      this.props.onElementChange(el.props.data[this.selectField]);
    }
  }

  render() {
    const { renderOnly = false } = this.props;

    return (
      <div className="ets-page-wrap">
        <MissionReportByODHTable noHeader={renderOnly} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={this.selectField} data={this.props.selectedReportDataODHS || []} {...this.props} />
      </div>
    );
  }
}

export default connectToStores(MissionReportByODH, ['missions']);
