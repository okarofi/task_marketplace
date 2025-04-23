'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  let data = [
    {
      "name": "Protein Bar Variety Pack",
      "price": 3000
    }, {
      "name": "Dog Frisbee Toy",
      "price": 5000
    }, {
      "name": "Pesto Genovese",
      "price": 6000
    }, {
      "name": "LED Flashing Pet Collar",
      "price": 6000
    }, {
      "name": "Rice Cakes",
      "price": 6000
    }, {
      "name": "Pineapple Teriyaki Chicken Mix",
      "price": 6000
    }, {
      "name": "Gluten-Free Brownies",
      "price": 6000
    }, {
      "name": "Caramelized Onion Dip Mix",
      "price": 6000
    }, {
      "name": "Bamboo Charcoal Air Purifier Bags",
      "price": 6000
    }, {
      "id": 10,
      "name": "Inflatable Paddle Board",
      "price": 6000
    }
  ]
  
  let addCreatedAt = data.map(el => {
    return {
      "name": el.name,
      "price": el.price,
      "createdAt": new Date(),
      "updatedAt": new Date()
    }
  })

  await queryInterface.bulkInsert('Products', addCreatedAt, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Products', null, {});
  }
};
