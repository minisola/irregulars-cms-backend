'use strict';

const {
  LinRouter,
  NotFound,
  groupRequired,
  disableLoading
} = require('lin-mizar');
const { getSafeParamId } = require('../../libs/util');
const {
  BookSearchValidator,
  CreateOrUpdateBookValidator
} = require('../../validators/book');

const { PositiveIdValidator } = require('../../validators/common');

const { BookNotFound } = require('../../libs/err-code');
const { Book } = require('../../models/book');
const { BookDao } = require('../../dao/book');

// book 的红图实例
const noticeApi = new LinRouter({
  prefix: '/v1/notice'
});

// book 的dao 数据库访问层实例
const bookDto = new BookDao();

noticeApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const book = await bookDto.getBook(id);
  if (!book) {
    throw new NotFound({
      msg: '没有找到相关公告'
    });
  }
  ctx.json(book);
});

noticeApi.get('/', async ctx => {
  const books = await bookDto.getBooks();
  if (!books || books.length < 1) {
    throw new NotFound({
      msg: '没有找到相关公告'
    });
  }
  ctx.json(books);
});

noticeApi.get('/search/one', async ctx => {
  const v = await new BookSearchValidator().validate(ctx);
  const book = await bookDto.getBookByKeyword(v.get('query.q'));
  if (!book) {
    throw new BookNotFound();
  }
  ctx.json(book);
});

noticeApi.post('/', async ctx => {
  const v = await new CreateOrUpdateBookValidator().validate(ctx);
  await bookDto.createBook(v);
  ctx.success({
    msg: '新建图书成功'
  });
});

noticeApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateBookValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await bookDto.updateBook(v, id);
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
    await bookDto.deleteBook(id);
    ctx.success({
      msg: '删除公告成功'
    });
  }
);

noticeApi.get('/', async ctx => {
  const books = await Book.findAll();
  if (books.length < 1) {
    throw new NotFound({
      msg: '没有找到相关公告'
    });
  }
  ctx.json(books);
});

module.exports = { noticeApi, [disableLoading]: false };
