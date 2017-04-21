import React, { Component, PropTypes } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'object_name',
      displayName: 'Наименование пункта назначения',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'status',
      displayName: 'Статус',
      type: 'string',
      filter: {
        type: 'multiselect',
        labelFunction: data => data === 'fail' ? 'Не пройден' : 'Пройден',
      },
    },
  ],
};

const MissionReportByPointsTable = (props) => {
  const renderers = {
    status: ({ data }) => <div>{data === 'fail' ? 'Не пройден' : 'Пройден'}</div>,
  };

  if (!(props.data && props.data.length)) {
    return <div>Нет данных о прохождении задания</div>;
  }

  return (
    <Table
      title="Прохождение заданий по пунктам назначения"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      {...props}
    />
  );
};

class MissionReportByPoints extends Component {

  static get propTypes() {
    return {
      renderOnly: PropTypes.bool,
      onElementChange: PropTypes.func,
      routeParams: PropTypes.object,
      selectedReportDataPoints: PropTypes.array,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    if (!this.props.renderOnly) {
      this.context.flux.getActions('missions').getMissionReportByPoints(this.props.routeParams.index);
    }
  }

  selectElement(el) {
    if (typeof this.props.onElementChange === 'function') {
      this.props.onElementChange(el.props.data[this.selectField]);
    }
  }

  render() {
    const { renderOnly = false } = this.props;

    return (
      <MissionReportByPointsTable
        noHeader={renderOnly}
        onRowSelected={this.selectElement.bind(this)}
        data={this.props.selectedReportDataPoints || []}
        {...this.props}
      />
    );
  }
}

MissionReportByPoints.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(MissionReportByPoints, ['missions']);
