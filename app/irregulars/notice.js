'use strict';

const { NotFound } = require('lin-mizar');
const { Notice } = require('../models/notice');

class NoticeClass {
  async getNotice (id) {
    const notice = await Notice.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    return notice;
  }
  async getNotices () {
    const notices = await Notice.findAll({
      attributes: { exclude: ['content'] },
      where: {
        delete_time: null
      },
      order: [
        ['id', 'DESC']
      ]
    });
    return notices;
  }
  async createNotice (v) {
    const notice = new Notice();
    notice.title = v.get('body.title');
    notice.content = v.get('body.content');
    notice.save();
  }

  async updateNotice (v, id) {
    const notice = await Notice.findByPk(id);
    if (!notice) {
      throw new NotFound({
        msg: '没有找到相关公告'
      });
    }
    notice.title = v.get('body.title');
    notice.content = v.get('body.content');
    notice.save();
  }

  async deleteNotice (id) {
    const notice = await Notice.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!notice) {
      throw new NotFound({
        msg: '没有找到相关公告'
      });
    }
    await notice.destroy();
  }
}

module.exports = { NoticeClass };
