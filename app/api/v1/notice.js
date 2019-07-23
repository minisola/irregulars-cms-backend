'use strict';

const {
  LinRouter,
  NotFound,
  groupRequired,
  disableLoading
} = require('lin-mizar');
const { getSafeParamId } = require('../../libs/util');
const {
  CreateOrUpdateNoticeValidator
} = require('../../validators/notice');

const { PositiveIdValidator } = require('../../validators/common');

const { NoticeNotFound } = require('../../libs/err-code');
const { NoticeClass } = require('../../irregulars/notice');

// notice 的红图实例
const noticeApi = new LinRouter({
  prefix: '/v1/notice'
});

// notice的数据库访问层实例
const noticeClass = new NoticeClass();

noticeApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const notice = await noticeClass.getNotice(id);
  if (!notice) {
    throw new NotFound({
      msg: '没有找到相关公告'
    });
  }
  ctx.json(notice);
});

noticeApi.get('/', async ctx => {
  const notices = await noticeClass.getNotices();
  if (!notices || notices.length < 1) {
    throw new NoticeNotFound({
      msg: '没有找到相关公告'
    });
  }
  ctx.json(notices);
});

noticeApi.post('/', async ctx => {
  console.log(ctx)
  const v = await new CreateOrUpdateNoticeValidator().validate(ctx);
  await noticeClass.createNotice(v);
  ctx.success({
    msg: '新增公告成功'
  });
});

noticeApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateNoticeValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await noticeClass.updateNotice(v, id);
  ctx.success({
    msg: '更新公告成功'
  });
});

noticeApi.linDelete(
  'deleteNotice',
  '/:id',
  {
    auth: '删除公告',
    module: '公告',
    mount: true
  },
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await noticeClass.deleteNotice(id);
    ctx.success({
      msg: '删除公告成功'
    });
  }
);

module.exports = { noticeApi, [disableLoading]: false };
