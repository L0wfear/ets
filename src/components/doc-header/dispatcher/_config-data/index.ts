import config from 'config';

export default {
  title: 'Руководство Диспетчера',
  path: `${config.docs}Руководство-диспетчера.docx`,
  noHash: true,
  permissions: {
    list: 'docs_dispatcher.list',
  },
};
