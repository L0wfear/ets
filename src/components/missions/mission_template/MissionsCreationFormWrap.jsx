import * as React from 'react';
import get from 'lodash/get';
import filter from 'lodash/filter';
import Div from 'components/ui/Div';
import { getDefaultMissionsCreationTemplate } from 'stores/MissionsStore';
import { getToday9am, getTomorrow9am, addTime } from 'utils/dates';
import { missionsCreationTemplateSchema } from 'models/MissionsCreationTemplateModel';

import FormWrap from 'components/compositions/FormWrap';
import IntervalPicker from 'components/ui/input/IntervalPicker';
import {
  checkMissionsByRouteType,
  checkMissionsOnStructureIdCar,
} from 'components/missions/utils/customValidate';
import { printData } from 'utils/functions';
import withMapInConsumer from 'components/new/ui/map/context/withMapInConsumer';

import MissionsCreationForm from 'components/missions/mission_template/MissionsCreationForm';
import { ASSING_BY_KEY } from 'components/directories/order/forms/utils/constant';
import { groupBy } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

const printMapKeyBig = 'mapMissionTemplateFormA3';
const printMapKeySmall = 'mapMissionTemplateFormA4';

export const createMissions = async (flux, element, payload) => {
  let error = false;
  try {
    await flux.getActions('missions').createMissions(element, payload);
    return false;
  } catch ({ error_text: e }) {
    error = true;
    const code = get(e, ['message', 'code'], null);

    if (code === 'no_active_waybill') {
      let cancel = false;
      try {
        await confirmDialog({
          title: 'Для ТС не существует активного ПЛ',
          body: 'Создать черновик ПЛ?',
        });
      } catch (err) {
        cancel = true;
      }
      if (!cancel) {
        const newPayload = {
          mission_source_id: payload.mission_source_id,
          passes_count: payload.passes_count,
          date_start: payload.date_start,
          date_end: payload.date_end,
          assign_to_waybill: 'assign_to_new_draft',
        };
        await createMissions(flux, element, newPayload);
      }
    }
    if (code === 'invalid_period') {
      const waybillNumber = e.message.message.split('№')[1].split(' ')[0];

      const body = (self) => (
        <div>
          <div>{e.message.message}</div>
          <br />
          <center>Введите даты задания:</center>
          <IntervalPicker
            interval={self.state.interval}
            onChange={(interval) => self.setState({ interval })}
          />
        </div>
      );

      let cancel = false;
      let state;
      try {
        state = await confirmDialog({
          title: <b>{`Задание будет добавлено в ПЛ №${waybillNumber}`}</b>,
          body,
          checkOnOk: (self) => {
            const {
              state: { interval },
            } = self;
            if (!interval || interval.some((date) => !date)) {
              global.NOTIFICATION_SYSTEM.notify(
                'Поля дат задания должны быть заполнены',
                'warning',
              );
              return false;
            }
            return true;
          },
        });
      } catch (err) {
        cancel = true;
      }
      if (!cancel) {
        const { interval = [getToday9am(), getTomorrow9am()] } = state;

        const newPayload = {
          mission_source_id: payload.mission_source_id,
          passes_count: payload.passes_count,
          date_start: interval[0],
          date_end: interval[1],
          assign_to_waybill: payload.assign_to_waybill,
        };

        await createMissions(flux, element, newPayload);
      }
    }
  }
  return error;
};

class MissionsCreationFormWrap extends FormWrap {
  constructor(props) {
    super(props);

    this.schema = missionsCreationTemplateSchema;

    this.state = {
      ...this.state,
    };
  }

  componentWillReceiveProps(props) {
    if (props.showForm && props.showForm !== this.props.showForm) {
      this.schema = missionsCreationTemplateSchema;
      const for_column = Object.values(this.props.missions).some(
        (missionData) => missionData.for_column,
      );

      const defaultMissionsCreationTemplate = getDefaultMissionsCreationTemplate(
        this.props.missions,
        for_column,
      );

      const formErrors = this.validate(defaultMissionsCreationTemplate, {});
      const dataTestRoute = checkMissionsByRouteType(
        Object.values(this.props.missions),
        defaultMissionsCreationTemplate,
      );

      defaultMissionsCreationTemplate.for_column = for_column;
      if (dataTestRoute.error) {
        defaultMissionsCreationTemplate.date_end = addTime(
          defaultMissionsCreationTemplate.date_start,
          dataTestRoute.time,
          'hours',
        );
      }

      this.setState({
        formState: defaultMissionsCreationTemplate,
        canSave: !filter(formErrors).length, // false,
        formErrors,
        needMoveDateEnd: dataTestRoute.error,
        countBumpDateEnd: dataTestRoute.time,
      });
    }
  }

  handleFormSubmit = async () => {
    const { formState } = this.state;
    const { _carsIndex = {}, missions = {} } = this.props;

    const missionsArr = Object.values(missions);

    if (!checkMissionsOnStructureIdCar(missionsArr, _carsIndex)) {
      const dataTestRoute = checkMissionsByRouteType(missionsArr, formState);

      if (dataTestRoute.error) {
        global.NOTIFICATION_SYSTEM.notify(
          `Время выполнения задания для ${
            dataTestRoute.title
          } должно составлять не более ${dataTestRoute.time} часов`,
          'error',
        );
      } else {
        const externalPayload = {
          mission_source_id: formState.mission_source_id,
          passes_count: formState.passes_count,
          date_start: formState.date_start,
          date_end: formState.date_end,
          assign_to_waybill: formState.assign_to_waybill,
          for_column: formState.for_column,
          norm_id: formState.norm_id,
        };

        if (
          externalPayload.assign_to_waybill[0]
          === ASSING_BY_KEY.assign_to_new_draft
        ) {
          const missionByCar = groupBy(missionsArr, 'car_ids');

          const ansArr = await Promise.all(
            Object.values(missionByCar).map(
              async ([firstMission, ...other]) => {
                const successFM = await this.createMissionWrap(
                  [firstMission],
                  externalPayload,
                );
                if (successFM) {
                  const successEvery = await this.createMissionWrap(other, {
                    ...externalPayload,
                    assign_to_waybill: ASSING_BY_KEY.assign_to_available_draft,
                  });
                  if (!successEvery) {
                    return false;
                  }
                  return true;
                }
                return false;
              },
            ),
          );

          if (!ansArr.some((ans) => !ans)) {
            this.props.onFormHide(true);
          }
        } else {
          const success = await this.createMissionWrap(
            missionsArr,
            externalPayload,
          );
          if (success) {
            this.props.onFormHide(true);
          }
        }
      }
    }
  };

  async createMissionWrap(missionsArr, externalPayload) {
    const { flux } = this.context;
    let success = true;
    try {
      await Promise.all(
        missionsArr.map(async (mission) => {
          const e = await createMissions(
            flux,
            { [mission.id]: mission },
            externalPayload,
          );

          if (e) {
            success = false;
          }
        }),
      );
    } catch (e) {
      success = false;
    }

    return success;
  }

  handlePrint = (mapKey) => {
    const f = this.state.formState;
    const { flux } = this.context;
    const data = {
      template_id: f.id,
      size: '',
    };

    if (mapKey === printMapKeyBig) {
      data.size = 'a3';
    }
    if (mapKey === printMapKeySmall) {
      data.size = 'a4';
    }

    this.props.getMapImageInBase64ByKey(mapKey).then((image) => {
      data.image = image;
      flux
        .getActions('missions')
        .printMissionTemplate(data)
        .then(({ blob }) => {
          printData(blob);
        });
    });
  };

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <MissionsCreationForm
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit}
          handleFormChange={this.handleFormStateChange}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          missions={this.props.missions}
          {...this.state}
        />
      </Div>
    );
  }
}

export default compose(
  connect((state) => ({
    userStructureId: getSessionState(state).userData.structure_id,
  })),
  withMapInConsumer(),
)(MissionsCreationFormWrap);
