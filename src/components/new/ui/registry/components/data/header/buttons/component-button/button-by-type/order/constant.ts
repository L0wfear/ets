export const order_types = {
  order_create_mission_by_templates: 'order_create_mission_by_templates',
  order_create_duty_mission_by_templates: 'order_create_duty_mission_by_templates',
  order_export: 'order_export',
  order_to_create_mission: 'order_to_create_mission',
  order_to_create_duty_mission: 'order_to_create_duty_mission',
};

export const order_types_reverse = Object.entries(order_types).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
