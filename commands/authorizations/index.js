'use strict'

const co = require('co')
const cli = require('heroku-cli-util')
const _ = require('lodash')

function * run (context, heroku) {
  let authorizations = yield heroku.get('/oauth/authorizations')
  authorizations = _.sortBy(authorizations, 'description')

  if (context.flags.json) {
    cli.styledJSON(authorizations)
  } else if (authorizations.length === 0) {
    cli.log('No OAuth authorizations.')
  } else {
    cli.table(authorizations, {
      printHeader: null,
      columns: [
        {key: 'description', format: v => cli.color.green(v)},
        {key: 'id'},
        {key: 'scope', format: v => v.join(',')}
      ]
    })
  }
}

module.exports = {
  topic: 'authorizations',
  description: 'list OAuth authorizations',
  needsAuth: true,
  flags: [
    {name: 'json', description: 'output in json format'}
  ],
  run: cli.command(co.wrap(run))
}
