const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelize) => {
    await queryInterface.createTable('entities_attributes', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      attributeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      entityId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    // Add foreign key constraints if needed
    await queryInterface.addConstraint('entities_attributes', {
      type: 'foreign key',
      name: 'fk_attributeId',
      fields: ['attributeId'],
      references: {
        table: 'attributes',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('entities_attributes', {
      type: 'foreign key',
      name: 'fk_entityId',
      fields: ['entityId'],
      references: {
        table: 'entities',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, sequelize) => {
    await queryInterface.dropTable('entities_attributes');
  },
};
