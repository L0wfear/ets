import * as React from 'react';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { getDefaultCarsConditionCarElement } from './utils';
import { BlockCarInfoOwnProps, BlockCarInfoProps } from './@types/BlockCarInfo';
import inspectCarsConditionPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { carsConditionCarFormSchema } from './schema';
import BlockCarInfoMainData from './blocks/main_data/BlockCarInfoMainData';
import BlockCarInfoMainCheckData from './blocks/check_data/BlockCarInfoMainCheckData';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import { Button } from 'react-bootstrap';
import { DivNone, FooterEnd } from 'global-styled/global-styled';
import { actionCreateCarsConditionsCar, actionUpdateCarsConditionsCar, actionGetCarsConditionsCarById } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';

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
      && props.type === INSPECT_AUTOBASE_TYPE_FORM.list
    );

    return (
      <div>
        <h4>Карточка выбранного ТС</h4>
        <BlockCarInfoMainData
          IS_CREATING={IS_CREATING}
          formState={state}
          formErrors={errors}
          handleChange={props.handleChange}
          isPermitted={isPermitted}

          page={props.page}
          path={props.path}
        />
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
                <Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить для текущей проверки</Button>
              )
              : (
                <DivNone />
              )
          }
          <Button onClick={props.hideWithoutChanges}>Закрыть</Button>
        </FooterEnd>
      </div>
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
