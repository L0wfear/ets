import React, { PropTypes } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import ElementsList from 'components/ElementsList.jsx';

const getTableMeta = (props) => {
  const tableMeta = {
    cols: [
      {
        name: 'object_name',
        displayName: 'ОДХ',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'check_value',
        displayName: `Нужно пройти (${props.data[0] && props.data[0].route_check_unit})`,
        type: 'string',
        filter: false,
      },
      {
        name: 'traveled_percentage',
        displayName: `Пройдено в рабочем режиме (${props.data[0] && props.data[0].route_check_unit})*`,
        type: 'string',
        filter: false,
      },
      {
        name: 'left_percentage',
        displayName: `Осталось (${props.data[0] && props.data[0].route_check_unit})`,
        type: 'string',
        filter: false,
      },
      {
        name: 'route_with_speed',
        displayName: 'Контроль (км.)**',
        type: 'string',
        filter: false,
      },
    ],
  };

  return tableMeta;
};


const MissionReportByODHTable = (props) => {
  const tableMeta = getTableMeta(props);

  const renderers = {
    traveled_percentage: data => (
      <div>
        {`${data.rowData.route_check_unit === 'раз' ? parseInt(data.rowData.traveled, 10) : parseFloat(data.rowData.traveled).toFixed(2)} ${data.rowData.route_check_unit}`}
        <br />
        {`(${`${parseFloat(parseFloat(data.data) * 100).toFixed(0)}%`})`}
      </div>
    ),
    left_percentage: data => (
      <div>
        {`${data.rowData.route_check_unit === 'раз' ? parseInt(data.rowData.left, 10) : parseFloat(data.rowData.left).toFixed(2)} ${data.rowData.route_check_unit}`}
        <br />
        {`(${`${parseFloat(parseFloat(data.data) * 100).toFixed(0)}%`})`}
      </div>
    ),
    check_value: meta => <div>{ `${meta.rowData.route_check_unit === 'кв. м.' || meta.rowData.route_check_unit === 'м.' ? parseFloat(meta.data).toFixed(2) : meta.data} ${meta.rowData.route_check_unit}` }</div>,
    route_with_speed: meta => <div>{`${parseFloat(meta.rowData.traveled / 1000).toFixed(3)} / ${parseFloat(meta.rowData.traveled_high_speed / 1000).toFixed(3)}`}</div>,
  };

  if (!(props.data && props.data.length)) {
    return <div>Нет данных о прохождении задания</div>;
  }

  return (
    <Table
      title="Прохождение заданий по ОДХ"
      initialSort="traveled_percentage"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      {...props}
    />
  );
};

class MissionReportByODH extends ElementsList {

  static get propTypes() {
    return {
      renderOnly: PropTypes.bool,
      onElementChange: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.selectField = props.selectField || 'obj_id';
    this.mainListName = 'selectedReportDataODHS';
  }

  async componentDidMount() {
    if (!this.props.renderOnly) {
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
      <MissionReportByODHTable
        noHeader={renderOnly}
        onRowSelected={this.selectElement.bind(this)}
        selected={this.state.selectedElement}
        selectField={this.selectField}
        data={this.props.selectedReportDataODHS || []}
        {...this.props}
      />
    );
  }
}

export default connectToStores(MissionReportByODH, ['missions']);
