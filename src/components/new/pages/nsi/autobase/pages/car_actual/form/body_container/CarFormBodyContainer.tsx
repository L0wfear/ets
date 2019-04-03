import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { componentsInArray } from '../formConfig';
import { Switch, Route } from 'react-router';
import { config } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';
import { Row } from 'react-bootstrap';

type CarFormBodyContainerOwnProps = {
  isPermitted: boolean;
};
type CarFormBodyContainerProps = (
  CarFormBodyContainerOwnProps
  & WithSearchProps
);

const CarFormBodyContainer: React.FC<CarFormBodyContainerProps> = (props) => {
  return (
    <Row>
      <Switch>
        {
          componentsInArray.map(({ path, component }) => (
            <Route path={`/nsi/autobase/car_actual/:${config.list.data.uniqKeyForParams}?${path}`} component={component}></Route>
          ))
        }
      </Switch>
    </Row>
  );
};

export default compose<CarFormBodyContainerProps, CarFormBodyContainerOwnProps>(
  withSearch,
)(CarFormBodyContainer);
