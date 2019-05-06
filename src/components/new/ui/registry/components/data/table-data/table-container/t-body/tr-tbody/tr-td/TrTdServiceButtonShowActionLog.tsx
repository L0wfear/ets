import * as React from 'react';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { compose } from 'recompose';
import { Service } from 'redux-main/reducers/modules/services/@types/services';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Button } from 'react-bootstrap';

type TrTdServiceButtonShowActionLogStateProps = {
  permissions: string | boolean;
};
type TrTdServiceButtonShowActionLogDispatchProps = {
};
type TrTdServiceButtonShowActionLogOwnProps = {
  registryKey: string;
  rowData: Service;
};
type TrTdServiceButtonShowActionLogMergedProps = (
  TrTdServiceButtonShowActionLogStateProps
  & TrTdServiceButtonShowActionLogDispatchProps
  & TrTdServiceButtonShowActionLogOwnProps
) & WithSearchProps;

type TrTdServiceButtonShowActionLogProps = TrTdServiceButtonShowActionLogMergedProps;

const TrTdServiceButtonShowActionLog: React.FC<TrTdServiceButtonShowActionLogProps> = React.memo(
  (props) => {
    const { rowData } = props;

    const handleClick = React.useCallback(
      async () => {
        //
      },
      [rowData],
    );

    return (
      <EtsTbodyTrTd>
        <Button disabled onClick={handleClick}>Открыть историю</Button>
      </EtsTbodyTrTd>
    );
  },
);

export default compose<TrTdServiceButtonShowActionLogProps, TrTdServiceButtonShowActionLogOwnProps>(
  withSearch,
)(TrTdServiceButtonShowActionLog);
