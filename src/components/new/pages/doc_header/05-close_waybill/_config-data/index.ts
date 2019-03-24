import config from 'config';

export default {
  title: 'Закрытие путевого листа',
  path: `${config.docs}Закрытие путевого листа.pdf`,
  noHash: true,
  permissions: {
    list: 'docs_close_waybill.list',
  },
};
