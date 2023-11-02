const { DataTypes } = require('sequelize');


module.exports = {
  up: async (queryInterface, sequelize) => {
    await queryInterface.createTable('attributes', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      onUpdate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      onDelete: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("STRING", "INTEGER", "FLOAT", "DATE", "BOOLEAN"),
        allowNull: false,
      },
      required: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      refId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
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
    await queryInterface.addConstraint('attributes', {
      type: 'foreign key',
      name: 'fk_refId',
      fields: ['refId'],
      references: {
        table: 'entities',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, sequelize) => {
    await queryInterface.dropTable('attributes');
  },
};
