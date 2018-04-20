import { getToday0am, getToday2359 } from 'utils/dates';
import { diffDates } from 'utils/dates.js';
import { getMElement, getDMElement, getMissionTemplateData } from 'redux/modules/order/utils';
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
} from 'redux/modules/order/action-order';

const initialState = {
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
}

export default function(state = initialState, { type, payload }) { 
  switch (type) {
    case SET_ORDERS:
      return {
        ...state,
        OrdersList: payload.OrdersList,
        pageOptions: payload.pageOptions,
        selectedElementOrder: null,
        total_count: payload.total_count,
        showHistoryComponent: false,
      }
    case SET_SELECTED_ELEMENT_ORDER:
      const { selectedElementOrder: selectedElementOrder_sseo } = payload;
      const { technical_operations } = selectedElementOrder_sseo;

      const disabledOrderButton = {
        templateMission: status === 'cancelled' || diffDates(new Date(), selectedElementOrder_sseo.order_date_to, 'minutes') > 0 || !technical_operations.some(({ num_exec }) => num_exec > 0),
        templateDutyMission: false,
      }
      disabledOrderButton.templateDutyMission = disabledOrderButton.templateMission || !(technical_operations.some(({ num_exec, work_type_name }) => (num_exec > 0) && (work_type_name === 'Ручные' || work_type_name === 'Комбинированный')));

      return {
        ...state,
        selectedElementOrder: selectedElementOrder_sseo,
        selectedElementAssignment: null,
        showHistoryComponent: false,
        disabledOrderButton,
      }
    case SET_SELECTED_ELEMENT_ASSIGNMENT:
      const { selectedElementOrder: { order_date_to, status: order_status } } = state;
    
      const {
        selectedElementAssignment,
        selectedElementAssignment: {
          work_type_name,
          num_exec,
        }
      } = payload;
      const dateTo = selectedElementAssignment.date_to || order_date_to;

      return {
        ...state,
        selectedElementAssignment: selectedElementAssignment,
        disabledAssignmentButton: {
          mission: !num_exec || diffDates(new Date(), dateTo) > 0 || order_status === 'cancelled',
          dutyMission: !((work_type_name === null || work_type_name === 'Ручные' || work_type_name === 'Комбинированный') && num_exec > 0) || diffDates(new Date(), dateTo) > 0,
        },
      }
    case SET_ORDER_HISTORY: {
      return {
        ...state,
        HistoryOrderDataList: payload.HistoryOrderDataList,
        showHistoryComponent: true,
      }
    }
    case SET_MISSION_DATA: {
      const mElement = getMElement(state, payload);

      return {
        ...state,
        missionData: {
          showForm: true,
          order: state.selectedElementOrder,
          mElement,
          initMission: { ...mElement },
        }
      }
    }
    case SET_DUTY_MISSION_DATA: {
      const dmElement = getDMElement(state, payload);

      return {
        ...state,
        missionData: {
          showForm: true,
          order: state.selectedElementOrder,
          dmElement,
          initDutyMission: { ...dmElement },
        }
      }
    }
    case SET_MISSION_TEMPLATE_DATA: {
      return {
        ...state,
        missionTemplateData: getMissionTemplateData(state, payload),
      }
    }
    case SET_EMPTY_MISSION_DATA: {
      return {
        ...state,
        missionData: {
          showForm: false,
        }
      }
    }
    case SET_EMPTY_DUTY_MISSION_DATA: {
      return {
        ...state,
        dutyMissionData: {
          showForm: false,
        }
      }
    }
    case SET_EMPTY_MISSION_TEMPLATE_DATA: {
      return {
        ...state,
        missionTemplateData: {
          showForm: false,
        },
      }
    }
    case RESET_ORDER: {
      return {
        ...initialState,
      }
    }
    default:
      return state;
  }
};
