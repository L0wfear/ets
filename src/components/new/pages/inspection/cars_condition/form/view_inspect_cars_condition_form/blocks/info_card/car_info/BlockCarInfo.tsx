import * as React from 'react';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { getDefaultCarsConditionCarElement } from './utils';
import { BlockCarInfoOwnProps, BlockCarInfoProps } from './@types/BlockCarInfo';
import inspectCarsConditionPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { carsConditionCarFormSchema } from './schema';
import BlockCarInfoMainData from './blocks/main_data/BlockCarInfoMainData';
import BlockCarInfoMainCheckData from './blocks/check_data/BlockCarInfoMainCheckData';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';

import { DivNone, FooterEnd, HrDelimiter } from 'global-styled/global-styled';
import { actionCreateCarsConditionsCar, actionUpdateCarsConditionsCar, actionGetCarsConditionsCarById } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';

const BlockCarInfo: React.FC<BlockCarInfoProps> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      IS_CREATING,
      isPermitted: isPermittedOwn,
    } = props;

    const isPermitted = (
      isPermittedOwn
      && props.type === INSPECT_TYPE_FORM.list
    );

    return (
      <BoxContainer>
        {
          !IS_CREATING
          ? <h2>Карточка выбранного ТС</h2>
          : <h2>Создание карточки ТС</h2>
        }
        <BlockCarInfoMainData
          IS_CREATING={IS_CREATING}
          formState={state}
          formErrors={errors}
          handleChange={props.handleChange}
          handleChangeBoolean={props.handleChangeBoolean}
          isPermitted={isPermitted}

          page={props.page}
          path={props.path}
        />
        <HrDelimiter />
        <BlockCarInfoMainCheckData
          IS_CREATING={IS_CREATING}
          formState={state}
          formErrors={errors}
          handleChange={props.handleChange}
          isPermitted={isPermitted}
        />
        <FooterEnd>
          {
            isPermitted
              ? (
                <EtsBootstrap.Button disabled={props.canSave} onClick={props.defaultSubmit}>Сохранить для текущей проверки</EtsBootstrap.Button>
              )
              : (
                <DivNone />
              )
          }
          <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Закрыть</EtsBootstrap.Button>
        </FooterEnd>
      </BoxContainer>
    );
  },
);

export default withForm<BlockCarInfoOwnProps, CarsConditionCars>({
  uniqField: 'id',
  getRecordAction: actionGetCarsConditionsCarById,
  createAction: actionCreateCarsConditionsCar,
  updateAction: actionUpdateCarsConditionsCar,
  mergeElement: (props) => {
    return getDefaultCarsConditionCarElement(props.element);
  },
  schema: carsConditionCarFormSchema,
  permissions: inspectCarsConditionPermissions,
})(BlockCarInfo);
