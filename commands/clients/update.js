'use strict'

let cli = require('heroku-cli-util')
let co = require('co')
let lib = require('../../lib/clients')

let empty = o => Object.keys(o).length === 0

function getUpdates (o) {
  let updates = {}

  if (o.url) updates.redirect_uri = lib.validateURL(o.url)
  if (o.name) updates.name = o.name

  if (empty(updates)) throw new Error('No changes provided.')
  return updates
}

function * run (context, heroku) {
  let id = context.args.id
  let request = heroku.request({
    method: 'PATCH',
    path: `/oauth/clients/${encodeURIComponent(id)}`,
    body: getUpdates(context.flags)
  })

  yield cli.action(`Updating ${cli.color.cyan(id)}`, request)
}

module.exports = {
  topic: 'clients',
  command: 'update',
  description: '(sudo) update OAuth client',
  args: [{name: 'id'}],
  flags: [
    {name: 'name', char: 'n', hasValue: true, description: 'change the client name'},
    {name: 'url', hasValue: true, description: 'change the client redirect URL'}
  ],
  needsAuth: true,
  run: cli.command(co.wrap(run))
}
