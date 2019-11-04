import * as React from 'react';
import { connect } from 'react-redux';

import Table from 'components/old/ui/table/DataTable';
import { sortFunc } from 'components/old/reports/operational/mission/utils/sortFunction';
import { getDelForUnitRender } from 'components/old/reports/operational/mission/utils/main';
import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const VALUE_FOR_FIXED = {
  TWO_F: {
    val: 2,
    list: ['кв. м.', 'м.'],
    type: 'floatFixed',
  },
  THREE_F: {
    val: 3,
    list: ['км'],
    type: 'floatFixed',
  },
  TEN_I: {
    val: 10,
    list: ['раз'],
    type: 'intFixed',
    another: {
      val: 2,
      type: 'floatFixed',
    },
  },
  floatFixed: (data, val) => parseFloat(data).toFixed(val),
  intFixed: (data, val) => parseInt(data, val),
};

const checkFixed = (data, key) => {
  const clone = [...data];

  if (VALUE_FOR_FIXED[key].list.includes(data[1])) {
    clone[0] = VALUE_FOR_FIXED[VALUE_FOR_FIXED[key].type](
      clone[0],
      VALUE_FOR_FIXED[key].val,
    );
  } else if ('another' in VALUE_FOR_FIXED[key]) {
    clone[0] = VALUE_FOR_FIXED[VALUE_FOR_FIXED[key].another.type](
      clone[0],
      VALUE_FOR_FIXED[key].another.val,
    );
  }

  return clone;
};

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
        displayName: `Нужно пройти (${props.data[0]
          && props.data[0].route_check_unit})`,
        type: 'string',
        filter: false,
      },
      {
        name: 'traveled_percentage',
        displayName: `Пройдено в рабочем режиме (${props.data[0]
          && props.data[0].route_check_unit})*`,
        type: 'string',
        filter: false,
      },
      {
        name: 'left_percentage',
        displayName: `Осталось (${props.data[0]
          && props.data[0].route_check_unit})`,
        type: 'string',
        filter: false,
      },
      {
        name: 'route_with_speed',
        displayName: `Контроль (${props.data[0]
          && (props.data[0].route_check_unit === 'м.'
            ? 'км.'
            : props.data[0].route_check_unit)})**`,
        type: 'string',
        sortFunc,
        filter: false,
      },
    ],
  };

  return tableMeta;
};

const renderers = {
  traveled_percentage: ({ data, rowData }) => (
    <div>
      {`${checkFixed(
        [rowData.traveled, rowData.route_check_unit],
        'TEN_I',
      ).join(' ')}`}
      <br />
      {`(${`${(data * 100).toFixed(0)}%`})`}
    </div>
  ),
  left_percentage: ({ data, rowData }) => (
    <div>
      {`${checkFixed([rowData.left, rowData.route_check_unit], 'TEN_I').join(
        ' ',
      )}`}
      <br />
      {`(${`${VALUE_FOR_FIXED.floatFixed(data * 100, 0)}%`})`}
    </div>
  ),
  check_value: ({ data, rowData }) => (
    <div>{`${checkFixed([data, rowData.route_check_unit], 'TWO_F').join(
      ' ',
    )}`}</div>
  ),
  route_with_speed: ({ rowData }) => (
    <div>{`${VALUE_FOR_FIXED.floatFixed(
      rowData.traveled / getDelForUnitRender(rowData.route_check_unit),
      3,
    )} / ${VALUE_FOR_FIXED.floatFixed(
      rowData.traveled_high_speed
        / getDelForUnitRender(rowData.route_check_unit),
      3,
    )}`}</div>
  ),
};

const MissionReportByODHTable = (props) => {
  const tableMeta = getTableMeta(props);

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

const emptyArr = [];

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

class MissionReportByODH extends React.Component<Props, any> {
  selectField: string;

  constructor(props) {
    super(props);

    this.selectField = props.selectField || 'obj_id';

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
      <MissionReportByODHTable
        noHeader
        onRowSelected={this.selectElement}
        selected={this.state.selectedElement}
        selectField={this.selectField}
        data={this.props.selectedReportDataODHS || emptyArr}
        {...this.props}
      />
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    userData: getSessionState(state).userData,
  }),
)(MissionReportByODH);
