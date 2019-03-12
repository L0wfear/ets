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
      status: selectedElementOrder.status,
    },
  };
};
