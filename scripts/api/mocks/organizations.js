import Mock from './Mock.js';

export default class OrganizationsMock extends Mock {

  constructor() {
    super();
    this.data = [
      {
        asuods_id: 1,
        name: 'ООО "Организация"',
        short_name: 'ООО "Оргнзц"',
        ogrn: '123134453345',
        inn: '123213123123',
        postal_address: 'ул. Пушкина д. Колотушкина',
        email: 'getalife@top.com',
        phone: '8 (800) 555-35-35',
        fax: '12345'
      }
    ];
  }

}
