import config from 'config';

export default {
  title: 'Выдача путевого листа без задания',
  path: `${config.docs}Выдача путевого листа без задания.pdf`,
  noHash: true,
  permissions: {
    list: 'docs_issue_a_waybill_without_mission.list',
  },
};
