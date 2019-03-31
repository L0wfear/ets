import { getToday0am, getToday2359 } from 'utils/dates';
import { diffDates } from 'utils/dates';
import { getMissionTemplateData } from 'redux-main/reducers/modules/order/utils';

import {
  SET_ORDERS,
  SET_SELECTED_ELEMENT_ORDER,
  SET_SELECTED_ELEMENT_ASSIGNMENT,
  SET_ORDER_HISTORY,
  SET_MISSION_DATA,
  SET_EMPTY_MISSION_DATA,
  SET_DUTY_MISSION_DATA,
  SET_EMPTY_DUTY_MISSION_DATA,
  SET_MISSION_TEMPLATE_DATA,
  SET_EMPTY_MISSION_TEMPLATE_DATA,
  RESET_ORDER,
} from 'redux-main/reducers/modules/order/action-order';
import { isString } from 'util';
import { IStateOrder } from 'redux-main/reducers/modules/order/@types';

const initialState: IStateOrder = {
  OrdersList: [],
  HistoryOrderDataList: [],
  selectedElementOrder: null,
  selectedElementAssignment: null,
  pageOptions: {
    limit: 15,
    offset: 0,
    date_start: getToday0am(),
    date_end: getToday2359(),
    sort_by: ['order_number:desc'],
    filter: {},
    haveMax: true,
  },
  total_count: 0,
  showHistoryComponent: false,
  disabledAssignmentButton: {
    mission: true,
    dutyMission: true,
  },
  disabledOrderButton: {
    templateMission: true,
    templateDutyMission: true,
  },
  missionData: {
    showForm: false,
  },
  dutyMissionData: {
    showForm: false,
  },
  missionTemplateData: {
    showForm: false,
  },
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SET_ORDERS: {
      return {
        ...state,
        OrdersList: payload.OrdersList,
        pageOptions: payload.pageOptions,
        selectedElementOrder: null,
        disabledOrderButton: {
          ...initialState.disabledOrderButton,
        },
        disabledAssignmentButton: {
          ...initialState.disabledAssignmentButton,
        },
        total_count: payload.total_count,
        showHistoryComponent: false,
      };
    }
    case SET_SELECTED_ELEMENT_ORDER: {
      const {
        selectedElementOrder: selectedElementOrder_sseo,
        selectedElementOrder: { status },
      } = payload;
      const { technical_operations } = selectedElementOrder_sseo;

      const disabledOrderButton = {
        templateMission:
          status === 'suspended' ||
          status === 'cancelled' ||
          diffDates(
            new Date(),
            selectedElementOrder_sseo.order_date_to,
            'minutes',
          ) > 0 ||
          !technical_operations.some(({ num_exec }) => num_exec > 0),
        templateDutyMission: false,
      };

      disabledOrderButton.templateDutyMission =
        disabledOrderButton.templateMission ||
        !technical_operations.some(
          ({ num_exec, work_type_name }) =>
            num_exec > 0
            && (
              (isString(work_type_name) && work_type_name.match(/^Ручн*/))
              || work_type_name === 'Комбинированный'
            ),
        );

      return {
        ...state,
        selectedElementOrder: selectedElementOrder_sseo,
        selectedElementAssignment: null,
        showHistoryComponent: false,
        disabledOrderButton,
        disabledAssignmentButton: {
          mission: true,
          dutyMission: true,
        },
      };
    }
    case SET_SELECTED_ELEMENT_ASSIGNMENT: {
      const {
        selectedElementOrder: { order_date_to, status: order_status },
      } = state;

      const {
        selectedElementAssignment,
        selectedElementAssignment: { work_type_name, num_exec },
      } = payload;
      const dateTo = selectedElementAssignment.date_to || order_date_to;

      return {
        ...state,
        selectedElementAssignment,
        disabledAssignmentButton: {
          mission:
            !num_exec ||
            diffDates(new Date(), dateTo) > 0 ||
            order_status === 'cancelled' ||
            order_status === 'suspended' ||
            (isString(work_type_name) && work_type_name.match(/^Ручн*/)),
          dutyMission:
            order_status === 'cancelled' ||
            order_status === 'suspended' ||
            !(
              (work_type_name === null ||
                (isString(work_type_name) && work_type_name.match(/^Ручн*/)) ||
                work_type_name === 'Комбинированный') &&
              num_exec > 0
            ) ||
            (num_exec <= 0 && order_status === 'partially_cancelled') ||
            diffDates(new Date(), dateTo) > 0,
        },
      };
    }
    case SET_ORDER_HISTORY: {
      return {
        ...state,
        HistoryOrderDataList: payload.HistoryOrderDataList,
        showHistoryComponent: true,
      };
    }
    case SET_MISSION_DATA: {
      return {
        ...state,
        missionData: {
          showForm: true,
          mElement: payload.partialMission,
        },
      };
    }
    case SET_DUTY_MISSION_DATA: {
      return {
        ...state,
        dutyMissionData: {
          showForm: true,
          dmElement: payload.partialDutyMission,
        },
      };
    }
    case SET_MISSION_TEMPLATE_DATA: {
      return {
        ...state,
        missionTemplateData: getMissionTemplateData(state, payload),
      };
    }
    case SET_EMPTY_MISSION_DATA: {
      return {
        ...state,
        missionData: {
          showForm: false,
        },
      };
    }
    case SET_EMPTY_DUTY_MISSION_DATA: {
      return {
        ...state,
        dutyMissionData: {
          showForm: false,
        },
      };
    }
    case SET_EMPTY_MISSION_TEMPLATE_DATA: {
      return {
        ...state,
        missionTemplateData: {
          showForm: false,
        },
      };
    }
    case RESET_ORDER: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}
