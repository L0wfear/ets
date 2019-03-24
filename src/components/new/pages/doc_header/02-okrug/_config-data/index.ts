import config from 'config';

export default {
  title: 'Руководство окружного пользователя',
  path: `${config.docs}Руководство-окружного-пользователя.docx`,
  noHash: true,
  permissions: {
    list: 'docs_okrug.list',
  },
};
