import * as React from 'react';
import { compose } from 'recompose';
import { Switch, Route } from 'react-router';
import { config } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';
import { Row } from 'react-bootstrap';
import { componentsInArray } from './formConfig';

type CarFormBodyContainerOwnProps = {
  isPermitted: boolean;
};
type CarFormBodyContainerProps = (
  CarFormBodyContainerOwnProps
);

const CarFormBodyContainer: React.FC<CarFormBodyContainerProps> = React.memo(() => {
  return (
    <Row>
      <Switch>
        {
          componentsInArray.map(({ path, component, tabKey }) => {
            return (
              <Route key={tabKey} path={`/nsi/autobase/car_actual/:${config.list.data.uniqKeyForParams}?${path}`} component={component}></Route>
            );
          })
        }
      </Switch>
    </Row>
  );
});

export default compose<CarFormBodyContainerProps, CarFormBodyContainerOwnProps>(
)(CarFormBodyContainer);
