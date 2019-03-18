import * as React from 'react';
import { InspectionAutobaseDataWrapProps } from './@types/InspectionAutobaseData';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { DivNone } from 'global-styled/global-styled';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import InspectionAutobaseData from './InspectionAutobaseData';

const InspectionAutobaseDataWrap: React.FC<InspectionAutobaseDataWrapProps> = (props) => {
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

  const carpoolId = getNumberValueFromSerch(searchState.carpoolId);

  return (
    carpoolId
      ? (
        <InspectionAutobaseData
          isFirst={isFirst}
          loadingPage={props.loadingPage}
          carpoolId={carpoolId}
        />
      )
      : (
        <DivNone />
      )
  );
};

export default withSearch(InspectionAutobaseDataWrap);
