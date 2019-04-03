import * as React from 'react';
import { compose } from 'recompose';
import { Switch, Route } from 'react-router';
import { config } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';
import { Row } from 'react-bootstrap';
import { componentsInArray } from './formConfig';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

type CarFormBodyContainerOwnProps = {
  isPermitted: boolean;
  formState: Car;
};
type CarFormBodyContainerProps = (
  CarFormBodyContainerOwnProps
);

const CarFormBodyContainer: React.FC<CarFormBodyContainerProps> = React.memo((props) => {
  return (
    <Row>
      <Switch>
        {
          componentsInArray.map(({ path, component: TabComponent, tabKey }) => {
            return (
              <Route
                key={tabKey}
                path={`/nsi/autobase/car_actual/:${config.list.data.uniqKeyForParams}?${path}`}
                render={
                  (routeProps) => (
                    <TabComponent
                      {...routeProps}
                      selectedCarData={props.formState}
                    />
                  )
                }
              />
            );
          })
        }
      </Switch>
    </Row>
  );
});

export default compose<CarFormBodyContainerProps, CarFormBodyContainerOwnProps>(
)(CarFormBodyContainer);
