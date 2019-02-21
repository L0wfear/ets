export default {
  list: `cars_count_deviation.${(process.env.STAND !== 'prod' || __DEVELOPMENT__) ? 'list' : 'false'}`,
  create: 'cars_count_deviation.create',
  read: 'cars_count_deviation.read',
  update: 'cars_count_deviation.update',
  delete: 'cars_count_deviation.delete',
};
