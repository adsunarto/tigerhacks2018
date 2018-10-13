const { Translate } = require('@google-cloud/translate')

const client = new Translate();

module.exports = async function translate(text, targetLanguage) {
  let results = await client.translate(text, targetLanguage)
  let translations = results[0].toString()
  return results[0]
}
