require('./initial');
const { db } = require('lin-mizar/lin/db');
const { Notice } = require('../../app/models/notice');

const run = async () => {
  await Notice.bulkCreate([
    {
      title: '深入理解计算机系统',
      content: 'Randal E.Bryant'
    },
    {
      title: 'C程序设计语言',
      content: '11111'
    }
  ]);
  db.close();
};

run();
