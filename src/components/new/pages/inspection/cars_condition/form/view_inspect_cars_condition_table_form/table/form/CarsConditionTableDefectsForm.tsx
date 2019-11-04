import * as React from 'react';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';
// import ExtField from 'components/@next/@ui/renderFields/Field';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

import { carsConditionTableDefectsFormSchema } from './schema';
import carsConditionTableDefectsPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
// import { autobaseCreateCarsConditionTableDefects, autobaseUpdateCarsConditionTableDefects } from 'redux-main/reducers/modules/autobase/actions_by_type/cars_condition_table_defects/actions';
import { PropsCarsConditionTableDefects, PropsCarsConditionTableDefectsWithForm } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form/table/form/@types/CarsConditionTableDefectsForm';
import { CarsConditionTableDefects } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import IAVisibleWarningContainer from 'components/new/pages/inspection/container/filed_to_check/IAVisibleWarningContainer';
import { filedToCheckDefectDataOuter, filedToCheckDefectDataFirstStart, filedToCheckDefectDataDocs } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/check_data/filedToCheckCarInfoMainCheckData';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { get } from 'lodash';
import { registryChangeRenderSelectedRow } from 'components/new/ui/registry/module/actions-registy';
import BlockCarsConditionCarSelectPhotoDefect from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/check_data/photo_defect/BlockCarsConditionCarSelectPhotoDefect';
import { isPermittedUpdateCarContidion } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/utils';

const CarsConditionTableDefectsForm: React.FC<any> = (props) => {
  const dispatch = etsUseDispatch();
  const title = 'Детализация дефектов';
  const valuesRenderRow = etsUseSelector((state) => get(getListData(state.registry, props.registryKey), `rendersFields.values`, null));
  const errorsRenderRow = etsUseSelector((state) => get(getListData(state.registry, props.registryKey), `rendersFields.errors`, null));

  const isPermittedUpdateInsp = isPermittedUpdateCarContidion(props.registryKey);
  const isPermitted = isPermittedUpdateInsp.isPermittedToUpdate && isPermittedUpdateInsp.isPermittedToUpdateClose;

  const handleChange = React.useCallback(
    (fieldValue) => {
      const [valField] = Object.entries(fieldValue);
      const fieldKey = valField[0];
      const fieldVal = valField[1];
      dispatch(
        registryChangeRenderSelectedRow(
          props.registryKey,
          {
            key: fieldKey,
            value: fieldVal,
          },
        ),
      );
    },
    [props.registryKey, valuesRenderRow],
  );

  return (
    <EtsBootstrap.ModalContainer id="modal-cars-condition-table-defects" bsSize="medium" show onHide={props.onFormHide}>
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={props.registryKey} path={''} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <h5>Выявленные дефекты ТС при внешнем осмотре:</h5>
            <IAVisibleWarningContainer
              onChange={handleChange}
              data={valuesRenderRow}
              errors={errorsRenderRow}
              isPermitted={isPermitted}
              filedToCheck={filedToCheckDefectDataOuter}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <h5>Выявленные дефекты при пробном пуске ТС:</h5>
            <IAVisibleWarningContainer
              onChange={handleChange}
              data={valuesRenderRow}
              errors={errorsRenderRow}
              isPermitted={isPermitted}
              filedToCheck={filedToCheckDefectDataFirstStart}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <h4>Проверка документации</h4>
            <IAVisibleWarningContainer
              onChange={handleChange}
              data={valuesRenderRow}
              errors={errorsRenderRow}
              isPermitted={isPermitted}
              filedToCheck={filedToCheckDefectDataDocs}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <BlockCarsConditionCarSelectPhotoDefect
              files={valuesRenderRow.files || []}
              onChange={handleChange}
              isPermitted={isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        {
          <EtsBootstrap.Button onClick={props.onFormHide}>Закрыть</EtsBootstrap.Button>
        }
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

// export default compose<PropsCarsConditionTableDefects, PropsCarsConditionTableDefectsWithForm>(
//   withForm<PropsCarsConditionTableDefectsWithForm, CarsConditionTableDefects>({
export default compose<PropsCarsConditionTableDefects, PropsCarsConditionTableDefectsWithForm>(
  withForm<PropsCarsConditionTableDefectsWithForm, CarsConditionTableDefects>({ // <<< замена any
    uniqField: 'id',
    schema: carsConditionTableDefectsFormSchema,
    permissions: carsConditionTableDefectsPermissions,
  }),
)(CarsConditionTableDefectsForm);
