import * as React from 'react';
import { InspectionPgmBaseDataWrapProps } from './@types/InspectionPgmBaseData';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { DivNone } from 'global-styled/global-styled';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import InspectionPgmBaseData from './InspectionPgmBaseData';

const InspectionPgmBaseDataWrap: React.FC<InspectionPgmBaseDataWrapProps> = (props) => {
  const [isFirst, setIsFirst] = React.useState(true);

  React.useEffect(
    () => {
      setIsFirst(false);
    },
    [],
  );

  const {
    searchState,
  } = props;

  const pgmBaseId = getNumberValueFromSerch(searchState.pgmBaseId);

  return (
    pgmBaseId
      ? (
        <InspectionPgmBaseData
          isFirst={isFirst}
          loadingPage={props.loadingPage}
          pgmBaseId={pgmBaseId}
        />
      )
      : (
        <DivNone />
      )
  );
};

export default withSearch(InspectionPgmBaseDataWrap);
