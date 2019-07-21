'use strict';

const { LinValidator, Rule } = require('lin-mizar');

class CreateOrUpdateNoticeValidator extends LinValidator {
  constructor () {
    super();
    this.title = new Rule('isNotEmpty', '必须传入标题');
    this.content = new Rule('isNotEmpty', '必须传入内容');
  }
}

module.exports = {
  CreateOrUpdateNoticeValidator
};
