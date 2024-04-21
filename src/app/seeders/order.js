'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Orders', [{
      id: 2,
      ID_User: 3,
      ID_Categori: 9,
      ID_Product: null,
      fullName: 'Trần Hoàng Trân',
      address: 'Đường số 2, Phường 3, Quận Ninh Kiều, Thành phố Cần Thơ',
      phone: '0971144857',
      email: 'tranhoangtran22225@gmail.com',
      desProblem: 'Bóng đèn bị nổ',
      desireDate: '2024-04-10T00:00:00.000Z',
      status: 'S',
      createdAt: '2024-04-03T09:20:20.000Z',
      updatedAt: '2024-04-12T06:30:58.000Z'
    }, {
      id: 3,
      ID_User: 3,
      ID_Categori: 4,
      ID_Product: 1,
      fullName: 'Trần Hoàng Trân',
      address: 'Đại học Cần Thơ',
      phone: '0978654321',
      email: 'tranhoangtran22225@gmail.com',
      desProblem: 'Của đóng không kính hơi',
      desireDate: '2024-04-11T00:00:00.000Z',
      status: 'S',
      createdAt: '2024-04-04T06:55:47.000Z',
      updatedAt: '2024-04-14T04:18:31.000Z'
    }, {
      id: 5,
      ID_User: 3,
      ID_Categori: 4,
      ID_Product: 2,
      fullName: 'test',
      address: 'test',
      phone: '0971144857',
      email: 'test@gmail.com',
      desProblem: 'Không sử dụng được',
      desireDate: '2024-04-09T00:00:00.000Z',
      status: 'C',
      createdAt: '2024-04-05T04:20:56.000Z',
      updatedAt: '2024-04-07T14:56:47.000Z'
    },
    {
      id: 6,
      ID_User: 5,
      ID_Categori: 11,
      ID_Product: 5,
      fullName: 'Trần Trường Duy',
      address: 'Đường số 3, Phường 2, Quận Ninh Kiều, Thành phố Cần Thơ',
      phone: '0987454231',
      email: 'omnoserhodsat3290@gmail.com',
      desProblem: 'Máy giặt bị rung lắc mạnh',
      desireDate: '2024-04-12T00:00:00.000Z',
      status: 'S',
      createdAt: '2024-04-08T03:00:39.000Z',
      updatedAt: '2024-04-17T03:19:51.000Z'
    },
    {
      id: 7,
      ID_User: 5,
      ID_Categori: 6,
      ID_Product: null,
      fullName: 'Trần Trường Duy',
      address: 'Đường số 1, Phường 2, Quận Ninh Kiều, Thành Phố Cần Thơ',
      phone: '0987456214',
      email: 'omnoserhodsat3290@gmail.com',
      desProblem: 'Rò rỉ điện ra ngoài',
      desireDate: '2024-04-10T00:00:00.000Z',
      status: 'S',
      createdAt: '2024-04-08T13:37:29.000Z',
      updatedAt: '2024-04-15T14:58:31.000Z'
    },
    {
      id: 8,
      ID_User: 5,
      ID_Categori: 9,
      ID_Product: null,
      fullName: 'Trần Trường Duy',
      address: 'Đường số 3, Phường 2, Quận Ninh Kiều, Thành Phố Cần Thơ',
      phone: '0987456213',
      email: 'omnoserhodsat3290@gmail.com',
      desProblem: 'Thay bóng đèn mới',
      desireDate: '2024-04-10T00:00:00.000Z',
      status: 'S',
      createdAt: '2024-04-09T05:41:55.000Z',
      updatedAt: '2024-04-17T14:32:04.000Z'
    },
    {
      id: 9,
      ID_User: 5,
      ID_Categori: 5,
      ID_Product: null,
      fullName: 'Trần Trường Duy',
      address: 'Đường số 02, Phường 03, Quận Ninh Kiều, Thành phố Cần Thơ',
      phone: '0987456545',
      email: 'omnoserhodsat3290@gmail.com',
      desProblem: 'Bồn cầu bị tắt',
      desireDate: '2024-04-15T00:00:00.000Z',
      status: 'S',
      createdAt: '2024-04-14T05:11:33.000Z',
      updatedAt: '2024-04-15T13:10:31.000Z'
    },
    {
      id: 10,
      ID_User: 3,
      ID_Categori: 4,
      ID_Product: 1,
      fullName: 'Trần Hoàng Trân',
      address: 'Đường số 01, Phường 2, Quận Ninh Kiều, Thành phố Cần Thơ',
      phone: '0987564321',
      email: 'tranhoangtran22225@gmail.com',
      desProblem: 'Cửa đóng không chặt',
      desireDate: '2024-04-17T00:00:00.000Z',
      status: 'S',
      createdAt: '2024-04-15T09:48:23.000Z',
      updatedAt: '2024-04-18T03:18:17.000Z'
    },
    {
      id: 11,
      ID_User: 5,
      ID_Categori: 11,
      ID_Product: 5,
      fullName: 'Trần Trường Duy',
      address: 'Đường số 3, Phường 2, Quận Ninh Kiều, Thành Phố Cần Thơ',
      phone: '0987654321',
      email: 'omnoserhodsat3290@gmail.com',
      desProblem: 'Máy giặt bị run lắc',
      desireDate: '2024-04-18T00:00:00.000Z',
      status: 'W',
      createdAt: '2024-04-17T03:50:37.000Z',
      updatedAt: '2024-04-17T03:50:37.000Z'
    },
    {
      id: 12,
      ID_User: 3,
      ID_Categori: 6,
      ID_Product: null,
      fullName: 'Trần Hoàng Trân',
      address: 'Đường số 2, Phường 3, Quận Ninh Kiều, Thành phố Cần Thơ',
      phone: '0987654321',
      email: 'tranhoangtran22225@gmail.com',
      desProblem: 'Rò rĩ điện',
      desireDate: '2024-04-21T00:00:00.000Z',
      status: 'S',
      createdAt: '2024-04-19T01:21:40.000Z',
      updatedAt: '2024-04-19T01:23:32.000Z'
    },
    {
      id: 13,
      ID_User: 3,
      ID_Categori: 6,
      ID_Product: null,
      fullName: 'Trần Hoàng Trân',
      address: 'Đường số 2, Phường 3, Quận Ninh Kiều',
      phone: '0987654321',
      email: 'tranhoangtran22225@gmail.com',
      desProblem: 'Rò rĩ điện',
      desireDate: '2024-04-22T00:00:00.000Z',
      status: 'S',
      createdAt: '2024-04-19T01:38:22.000Z',
      updatedAt: '2024-04-19T01:49:09.000Z'
    }]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
