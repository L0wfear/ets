import Mock from '../Mock'

describe('Mock', () => {
  let $rootScope, makeController;
  let data = [
    {
      id: 0,
      name: 'abc'
    },
    {
      id: 1,
      name: 'bcd'
    }
  ];


  describe('Get', () => {
    it('serves GET request', () => {
      let mock = new Mock(data);
      const result = mock.get().results;
      expect(result).to.deep.equal(data);
    });
  });

  describe('Delete', () => {
    it('serves DELETE request', () => {
      let mock = new Mock(data);
      const dataWithoutFirstElement = data.slice(1);
      const result = mock.delete({id: 0}).results;
      expect(result).to.deep.equal(dataWithoutFirstElement);
    });
  });

  describe('Post', () => {
    it('serves POST request', () => {
      let mock = new Mock(data);
      const clonedData = data.slice();
      const name = 'dwqdqw';
      clonedData.push({id: 2, name});
      const result = mock.post({name}).results;
      expect(result).to.deep.equal(clonedData);
    });
  });
});
