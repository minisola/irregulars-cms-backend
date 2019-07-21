'use strict';

const { InfoCrudMixin } = require('lin-mizar/lin/interface');
const { merge } = require('lodash');
const { Sequelize, Model } = require('sequelize');
const { db } = require('lin-mizar/lin/db');

class Notice extends Model {
  toJSON () {
    let origin = {
      id: this.id,
      title: this.title,
      author: this.content,
      createTime: this.createTime,
      updateTime: this.updateTime
    };
    return origin;
  }
}

Notice.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(80),
      allowNull: false
    },
    content: {
      type: Sequelize.STRING(20000),
      allowNull: false
    }
  },
  merge(
    {
      tableName: 'notice',
      modelName: 'notice',
      sequelize: db
    },
    InfoCrudMixin.options
  )
);

module.exports = { Notice };
