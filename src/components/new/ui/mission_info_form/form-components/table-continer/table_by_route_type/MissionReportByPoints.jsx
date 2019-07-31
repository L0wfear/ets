import * as React from 'react';
import * as PropTypes from 'prop-types';
import Table from 'components/old/ui/table/DataTable';
import { compose } from 'recompose';
import { getSessionState } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';

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
        labelFunction: (data) => (data === 'fail' ? 'Не пройден' : 'Пройден'),
      },
    },
  ],
};

const MissionReportByPointsTable = (props) => {
  const renderers = {
    status: ({ data }) => (
      <div>{data === 'fail' ? 'Не пройден' : 'Пройден'}</div>
    ),
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

class MissionReportByPoints extends React.Component {
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

    this.selectField = props.selectField || 'frontId';

    this.state = {
      selectedElement: null,
    };
  }

  componentDidMount() {}

  selectElement = (el) => {
    const {
      props: { data },
    } = el;
    this.setState({ selectedElement: data });
    if (typeof this.props.onElementChange === 'function') {
      this.props.onElementChange(el.props.data[this.selectField]);
    }
  };

  render() {
    return (
      <MissionReportByPointsTable
        noHeader
        onRowSelected={this.selectElement}
        selected={this.state.selectedElement}
        selectField={this.selectField}
        data={this.props.selectedReportDataPoints || []}
        {...this.props}
      />
    );
  }
}

MissionReportByPoints.contextTypes = {
  flux: PropTypes.object,
};

export default compose(
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(MissionReportByPoints);
