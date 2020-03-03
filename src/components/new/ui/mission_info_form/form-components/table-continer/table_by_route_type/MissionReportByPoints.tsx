import * as React from 'react';
import { connect } from 'react-redux';

import Table from 'components/old/ui/table/DataTable';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { ReduxState } from 'redux-main/@types/state';

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

type StateProps = {
  userData: InitialStateSession['userData'];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {
  [k: string]: any;
};

type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

class MissionReportByPoints extends React.Component<Props, any> {
  selectField: string;

  constructor(props) {
    super(props);

    this.selectField = props.selectField || 'frontId';

    this.state = {
      selectedElement: null,
    };
  }

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

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    userData: getSessionState(state).userData,
  }),
)(MissionReportByPoints);
