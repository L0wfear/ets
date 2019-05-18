import * as React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { getDefaultMissionTemplateElement, checkMissionsOnStructureIdCar, makeMissionsByTemplate, createMissionByTemplate, makePartialMission } from './utils';
import { missionTemplateCreatingFormSchema } from './schema';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { DivNone } from 'global-styled/global-styled';
import missionTemplatePermissions from 'components/new/pages/missions/mission_template/_config-data/permissions';

import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import { ReduxState } from 'redux-main/@types/state';
import {
  PropsMissionTemplateCreatingForm,
  StatePropsMissionTemplate,
  DispatchPropsMissionTemplate,
  OwnMissionTemplateProps,
  PropsMissionTemplateWithForm,
  MissionTemplateCreating,
} from './@types/MissionTemplateCreatingForm';
import { ExtField } from 'components/ui/new/field/ExtField';
import FieldMissionSourceMission from 'components/new/pages/missions/mission/form/main/inside_fields/mission_source_id/FieldMissionSourceMission';
import FieldNormIdMissionTemplateCreating from './inside_fields/norm_id/FieldNormIdMissionTemplateCreating';
import FieldDatesMissionTemplateCreating from './inside_fields/dates/FieldDatesMissionTemplateCreating';
import FieldAssignToWaybillMissionTemplateCreating from './inside_fields/assign_to_waybill/FieldAssignToWaybillMissionTemplateCreating';
import ColumnAssignmentFormWrap from './inside_fields/column_assignment_form_wrap/ColumnAssignmentFormWrap';
import { isBoolean } from 'util';
import { getMissionsState } from 'redux-main/reducers/selectors';
import { ASSING_BY_KEY } from 'components/directories/order/forms/utils/constant';

/**
 * Форма шаблона наряд-заданий
 * Собирается из формы наряд-задания
 */
const MissionTemplateCreatingForm: React.FC<PropsMissionTemplateCreatingForm> = (props) => {
  const [showColumnAssignmentFormWrap, setShowColumnAssignmentFormWrap] = React.useState(false);
  const {
    formState: state,
    formErrors: errors,
    page, path,
    isPermitted,
  } = props;

  const title = 'Формирование заданий из шаблонов';

  // для валидации перед заданием и отображения тс при создании на колонну
  React.useEffect(
    () => {
      props.actionGetAndSetInStoreCarForMission(
        {},
        { page, path },
      );

      return () => {
        props.actionResetCarsMission();
      };
    },
    [],
  );

  // если нет шаблонов, то ливаем
  React.useEffect(
    () => {
      if (!Object.values(state.missionTemplates).length) {
        props.handleHide(false);
      }
    },
    [state.missionTemplates],
  );

  /**
   * мясо
   */
  const handleSubmit = React.useCallback(
    async () => {
      const missionTemplatesAsArr = Object.values(state.missionTemplates);

      const notPermitedMissionsNumber = checkMissionsOnStructureIdCar(missionTemplatesAsArr, props.carForMissionIndex);                       // проверка на принадлежность тс к подразделениям шаблонов
      if (notPermitedMissionsNumber.length) {
        global.NOTIFICATION_SYSTEM.notify(
          `Подразделение выбранного шаблона задания № ${
            notPermitedMissionsNumber.join(', ')
          } не соответствует подразделению транспортного средства. Необходимо скорректировать шаблон задания, либо выбрать другой шаблон.`,
          'error',
        );

        return [];
      }

      const missionTemplateByCar = makeMissionsByTemplate(state.missionTemplates, state.assign_to_waybill);                   // группировка заданий по ТС

      return Promise.all(
        Object.values(missionTemplateByCar).map(async (missionsByCar) => {
          if (missionsByCar[0].assign_to_waybill[0] === ASSING_BY_KEY.assign_to_new_draft) {                                  // Если первое задание идёт с привязкой к новому черновику ПЛ
            const hasError = await createMissionByTemplate(
              props.submitAction,
              makePartialMission(
                missionsByCar[0],
                state,
              ),
              {
                page, path,
              },
            );

            if (!hasError) {
              return Promise.all(                                                                                             // То остальные задания должны докидываться в уже созданный ПЛ
                missionsByCar.slice(1).map((missionData) => (
                  createMissionByTemplate(
                    props.submitAction,
                    makePartialMission(
                      {
                        ...missionData,
                        assign_to_waybill: missionData.assign_to_waybill.map(() => ASSING_BY_KEY.assign_to_available_draft),
                      },
                      state,
                    ),
                    {
                      page, path,
                    },
                  )
                )),
              );
            }

            return [[hasError]];
          }

          return Promise.all(                                           // Стандартное создание
            missionsByCar.map((missionData) => (
              createMissionByTemplate(
                props.submitAction,
                makePartialMission(
                  missionData,
                  state,
                ),
                {
                  page, path,
                },
              )
            )),
          );
        }),
      );
    },
    [state, props.submitAction, props.carForMissionIndex],
  );

  const handleSubmitWrap = React.useCallback(
    async () => {
      if (!Object.values(state.missionTemplates).some(({ car_ids }) => car_ids.length > 1)) {     // Если создаётся НЕ на колонну
        let result = [];
        try {
          result = await handleSubmit();
        } catch (error) {
          return;
        }

        if (!result.some((resultByCar) => resultByCar.some((hasEror) => hasEror))) {
          props.handleHide(true);
        }
      } else {                                                                                    // Если на колонну, то открываем форму
        setShowColumnAssignmentFormWrap(true);
      }
    },
    [state, handleSubmit],
  );

  const handleSubmitColumnt = React.useCallback(
    async (isSubmitted) => {
      if (isBoolean(isSubmitted) && isSubmitted) {
        const response = await handleSubmit();
        if (response[0][0]) {                         // сложна
          return false;
        }
        props.handleHide(true);
        return true;
      }
      setShowColumnAssignmentFormWrap(false);
    },
    [state, handleSubmit],
  );

  return (
    <React.Fragment>
      <EtsBootstrap.ModalContainer
        id="modal-duty-mission-template-creating"
        show
        onHide={props.hideWithoutChanges}
        bsSize="large"
        backdrop="static"
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <FieldDatesMissionTemplateCreating
            date_start={state.date_start}
            error_date_start={errors.date_start}
            date_end={state.date_end}
            error_date_end={errors.date_end}
            isPermitted={isPermitted}
            disabled={!isPermitted}

            missionTemplates={state.missionTemplates}

            onChange={props.handleChange}
            page={page}
            path={path}
            />
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <FieldMissionSourceMission
                value={state.mission_source_id}
                name={state.mission_source_name}
                error={errors.mission_source_id}
                disabled={!isPermitted}
                isPermitted={isPermitted}
                onChange={props.handleChange}
                page={page}
                path={path}
              />
              <div className="help-block-mission-source">
                Задания на основе централизованных заданий необходимо
                создавать во вкладке "НСИ"-"Реестр централизованных заданий".
              </div>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <ExtField
                id="passes-count"
                type="number"
                label="Количество циклов"
                error={errors.passes_count}
                disabled={!isPermitted}
                value={state.passes_count}
                onChange={props.handleChange}
                boundKeys="passes_count"
              />
            </EtsBootstrap.Col>
            <FieldNormIdMissionTemplateCreating
              date_start={state.date_start}
              missionTemplates={state.missionTemplates}

              onChange={props.handleChange}
              page={page}
              path={path}
            />
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <FieldAssignToWaybillMissionTemplateCreating
            assign_to_waybill={state.assign_to_waybill}
            missionTemplates={state.missionTemplates}
            onChange={props.handleChange}

            page={page}
          />
          {isPermitted ? ( // либо обновление, либо создание
            <EtsBootstrap.Button
              disabled={!props.canSave}
              onClick={handleSubmitWrap}>
              Сформировать
            </EtsBootstrap.Button>
          ) : (
            <DivNone />
          )}
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
      <ColumnAssignmentFormWrap
        showColumnAssignmentFormWrap={showColumnAssignmentFormWrap}
        missionTemplates={state.missionTemplates}
        assign_to_waybill={state.assign_to_waybill}

        handleSubmit={handleSubmitColumnt}

        onChange={props.handleChange}
        page={page}
        path={path}
      />
    </React.Fragment>
  );
};

export default compose<PropsMissionTemplateCreatingForm, OwnMissionTemplateProps>(
  connect<StatePropsMissionTemplate, DispatchPropsMissionTemplate, OwnMissionTemplateProps, ReduxState>(
    (state) => ({
      carForMissionIndex: getMissionsState(state).missionData.carsIndex,
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreCarForMission: (...arg) => (
        dispatch(
          missionsActions.actionGetAndSetInStoreCarForMission(...arg),
        )
      ),
      actionResetCarsMission: (...arg) => (
        dispatch(
          missionsActions.actionResetCarsMission(...arg),
        )
      ),
    }),
  ),
  withForm<PropsMissionTemplateWithForm, MissionTemplateCreating>({
    uniqField: false,
    createAction: missionsActions.actionCreateMission,
    withThrow: true,
    mergeElement: ({ element }) => {
      return getDefaultMissionTemplateElement(element);
    },
    schema: missionTemplateCreatingFormSchema,
    permissions: missionTemplatePermissions,
  }),
)(MissionTemplateCreatingForm);
