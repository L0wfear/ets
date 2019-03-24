import config from 'config';

export default {
  title: 'Руководство Мастера',
  path: `${config.docs}Руководство-мастера.docx`,
  noHash: true,
  permissions: {
    list: 'docs_master.list',
  },
};
