import * as React from 'react';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { getDefaultCarsConditionCarElement } from './utils';
import { BlockCarInfoOwnProps, BlockCarInfoProps } from './@types/BlockCarInfo';
import inspectCarsConditionPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { carsConditionCarFormSchema } from './schema';
import BlockCarInfoMainData from './blocks/main_data/BlockCarInfoMainData';
import BlockCarInfoMainCheckData from './blocks/check_data/BlockCarInfoMainCheckData';

import { DivNone, FooterEnd, HrDelimiter } from 'global-styled/global-styled';
import { actionCreateCarsConditionsCar, actionUpdateCarsConditionsCar, actionGetCarsConditionsCarById } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { get } from 'lodash';

const BlockCarInfo: React.FC<BlockCarInfoProps> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      IS_CREATING,
      isPermittedChangeListParams,
    } = props;

    const isCustomUserCard = !Boolean(get(state, 'car_id'));
    const cardTitle = !IS_CREATING
      ? isCustomUserCard
        ? 'Карточка выбранного ТС (создана вручную)'
        : 'Карточка выбранного ТС'
      : 'Создание карточки ТС';

    return (
      <BoxContainer>
        <h2>{cardTitle}</h2>
        <BlockCarInfoMainData
          IS_CREATING={IS_CREATING}
          formState={state}
          formErrors={errors}
          handleChange={props.handleChange}
          handleChangeBoolean={props.handleChangeBoolean}
          isPermitted={isPermittedChangeListParams}
          isCustomUserCard={isCustomUserCard}

          page={props.page}
          path={props.path}
        />
        <HrDelimiter />
        <BlockCarInfoMainCheckData
          IS_CREATING={IS_CREATING}
          formState={state}
          formErrors={errors}
          handleChange={props.handleChange}
          isPermitted={isPermittedChangeListParams}
          isCustomUserCard={isCustomUserCard}
        />
        <FooterEnd>
          {
            isPermittedChangeListParams
              ? (
                <EtsBootstrap.Button disabled={false} onClick={props.defaultSubmit}>Сохранить для текущей проверки</EtsBootstrap.Button>
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
