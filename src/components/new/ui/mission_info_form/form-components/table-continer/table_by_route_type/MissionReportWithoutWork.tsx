import * as React from 'react';

import Table from 'components/old/ui/table/DataTable';

import { get } from 'lodash';
import styled from 'styled-components';

const getTableMeta = (props) => {
  const tableMeta = {
    cols: [
      {
        name: 'name',
        displayName: 'ОДХ',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };

  return tableMeta;
};

const renderers = {};

const MissionReportEntriesWithoutWorkTable = (props) => {
  const tableMeta = getTableMeta(props);

  if (!(props.data && props.data.length)) {
    return <div></div>;
  }

  return (
    <Table
      title="Холостой ход (указанный в маршруте)"
      initialSort="traveled_percentage"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      noFilter
      {...props}
    />
  );
};

const emptyArr = [];

type Props = {
  renderOnly: boolean;
  enumerated: boolean;
  selectedReportDataWithoutWork: Array<any>;
  selectField: string;
  onElementChange: (id: number) => any;
  normInitialData: boolean;
};

export const MissionReportEntriesWithoutWorkTableStyled = styled(MissionReportEntriesWithoutWorkTable)`
  margin-top: 15px;
`;

export const MissionReportEntriesWithoutWork: React.FC<Props> = (props) => {

  const [selectedElement, setSelectedElement] = React.useState(null);
  const [selectField, setSelectField] = React.useState(null);

  React.useEffect(() => {
    setSelectField(props.selectField || 'obj_id');
  }, []);

  const selectElement = React.useCallback((el) => {
    const data = get(el, 'props.data');

    setSelectedElement(data);

    if (typeof props.onElementChange === 'function') {
      props.onElementChange(data[selectField]);
    }
  }, [props.onElementChange, props.onElementChange, selectField, ]);

  return (
    <MissionReportEntriesWithoutWorkTableStyled
      onRowSelected={selectElement}
      selected={selectedElement}
      selectField={selectField}
      data={props.selectedReportDataWithoutWork || emptyArr}
      {...props}
    />
  );
};
