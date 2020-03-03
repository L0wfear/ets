import config from 'config';
import { ConfigPageData } from 'components/@next/@types/config_data';

const master_page_config: ConfigPageData = {
  title: 'Руководство Мастера',
  path: `${config.docs}Руководство-мастера.docx`,
  noHash: true,
  permissions: {
    list: 'docs_master.list',
  },
};

export default master_page_config;
