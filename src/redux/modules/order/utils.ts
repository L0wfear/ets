import { getToday9am } from 'utils/dates';
import { getDefaultMission, getDefaultDutyMission } from 'stores/MissionsStore.js';

export const getMElement = (state, payload) => {
  const {
    selectedElementAssignment,
    selectedElementOrder,
  } = state;

  return {
    ...getDefaultMission(getToday9am()),
    mission_source_id: payload.mission_source_id,
    technical_operation_id: selectedElementAssignment.id,
    municipal_facility_id: selectedElementAssignment.municipal_facility_id,
    faxogramm_id: selectedElementOrder.id,
    order_number: selectedElementOrder.order_number,
    order_operation_id: selectedElementAssignment.order_operation_id,
    passes_count: selectedElementAssignment.num_exec,
    norm_id: selectedElementAssignment.norm_id,
    date_start: selectedElementAssignment.date_from || selectedElementOrder.order_date,
    date_end: selectedElementAssignment.date_to || selectedElementOrder.order_date_to,
  };
};

export const getDMElement = (state, payload) => {
  const {
    selectedElementAssignment,
    selectedElementOrder,
  } = state;

  return {
    ...getDefaultDutyMission(),
    mission_source_id: payload.mission_source_id,
    technical_operation_id: selectedElementAssignment.id,
    municipal_facility_id: selectedElementAssignment.municipal_facility_id,
    faxogramm_id: selectedElementOrder.id,
    order_number: selectedElementOrder.order_number,
    order_operation_id: selectedElementAssignment.order_operation_id,
    passes_count: selectedElementAssignment.num_exec,
    norm_id: selectedElementAssignment.norm_id,
    plan_date_start: selectedElementAssignment.date_from || selectedElementOrder.order_date,
    plan_date_end: selectedElementAssignment.date_to || selectedElementOrder.order_date_to,
    status: 'not_assigned',
  };
};

export const getMissionTemplateData = (state, payload) => {
  const { selectedElementOrder } = state;

  return {
    ...payload,
    showForm: true,
    technical_operations: selectedElementOrder.technical_operations,
    orderDates: {
      order_date: selectedElementOrder.order_date,
      order_date_to: selectedElementOrder.order_date_to,
      faxogramm_id: selectedElementOrder.id,
    }
  }
};
