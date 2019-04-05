import * as React from 'react';
import { compose } from 'recompose';
import { Row } from 'react-bootstrap';
import { componentsInArray } from './formConfig';
import { get } from 'lodash';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../@types/CarForm';
import { DivNone } from 'global-styled/global-styled';

type CarFormBodyContainerOwnProps = {
  isPermitted: boolean;
  formState: CarWrap;
  formErrors: any;
  onChange: FormWithHandleChange<CarWrap>;
  onChangeBoolean: FormWithHandleChangeBoolean<CarWrap>;

  page: string;
  path: string;
};
type CarFormBodyContainerProps = (
  CarFormBodyContainerOwnProps
) & WithSearchProps;

const componentsInArrayAsObject = componentsInArray.reduce((newObj, tabData) => {
  newObj[tabData.tabKey] = tabData;
  return newObj;
}, {});

const CarFormBodyContainer: React.FC<CarFormBodyContainerProps> = React.memo(
  (props) => {
    const currentTabKey = get(props, 'match.params.tabKey', null);

    if (currentTabKey in componentsInArrayAsObject) {
      const TabComponent = componentsInArrayAsObject[currentTabKey].component;

      if (componentsInArrayAsObject[currentTabKey].isRegistry) {
        return (
          <Row>
            <TabComponent
              selectedCarData={props.formState}
            />
          </Row>
        );
      }

      return (
        <TabComponent
          formState={props.formState}
          formErrors={props.formErrors}
          onChange={props.onChange}
          onChangeBoolean={props.onChangeBoolean}
          isPermitted={props.isPermitted}

          page={props.page}
          path={props.path}
        />
      );
    }

    return (
      <DivNone />
    );
});

export default compose<CarFormBodyContainerProps, CarFormBodyContainerOwnProps>(
  withSearch,
)(CarFormBodyContainer);
