import config from 'config';

export default {
  title: 'Выдача путевого листа с заданием',
  path: `${config.docs}Выдача путевого листа с заданием.pdf`,
  noHash: true,
  permissions: {
    list: 'docs_issue_a_waybill.list',
  },
};
