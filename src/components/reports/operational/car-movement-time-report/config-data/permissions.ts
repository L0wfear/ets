export default {
  list: `car_movement_time_report.${process.env.STAND !== 'prod' ? 'list' : 'false'}`,
  create: 'car_movement_time_report.create',
  read: 'car_movement_time_report.read',
  update: 'car_movement_time_report.update',
  delete: 'car_movement_time_report.delete',
};
