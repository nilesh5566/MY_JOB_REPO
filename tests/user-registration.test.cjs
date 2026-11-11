const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const bcrypt = require('bcryptjs')

// Load the actual TypeScript model without starting Next.js or connecting to a DB.
const filename = path.resolve(__dirname, '../lib/models/User.ts')
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText
const modelModule = new Module(filename, module)
modelModule.filename = filename
modelModule.paths = Module._nodeModulePaths(path.dirname(filename))
modelModule._compile(compiled, filename)
const { User } = modelModule.exports

test('consecutive password and Clerk signups satisfy the legacy unique username index', async () => {
  const usernames = new Set([null]) // A legacy account already has no username.
  const originalInsert = User.collection.insertOne
  User.collection.insertOne = async (document) => {
    const username = document.username ?? null
    if (usernames.has(username)) {
      const error = new Error('Duplicate username')
      error.code = 11000
      throw error
    }
    usernames.add(username)
    return { acknowledged: true, insertedId: document._id }
  }
  try {
    for (const [i, clerkId] of ['', '', 'clerk-test'].entries()) {
      const user = new User({
        name: 'Registration test', email: `registration-${i}@example.invalid`,
        password: 'test-password-only', clerkId,
      })
      await user.save()
      assert.equal(user.isNew, false)
      assert.equal(typeof user.username, 'string')
      assert.ok(user.username.length > 0)
      assert.notEqual(user.password, 'test-password-only')
      assert.equal(await bcrypt.compare('test-password-only', user.password), true)
    }
    assert.equal(usernames.size, 4)
  } finally {
    User.collection.insertOne = originalInsert
  }
})

test('loading an existing account preserves its username', () => {
  const user = User.hydrate({
    name: 'Existing account', email: 'existing@example.invalid',
    username: 'existing-username', password: 'existing-hash',
  })
  assert.equal(user.username, 'existing-username')
  user.username = 'replacement'
  assert.equal(user.username, 'existing-username')
})
