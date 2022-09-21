const { RESTDataSource } = require('apollo-datasource-rest')

class techQuotesAPI extends RESTDataSource {
  constructor() {
    // Always call super()
    super()
    // Sets the base URL for the REST API
    this.baseURL = 'https://programming-quotes-api.herokuapp.com/quotes/'
  }

  async getTechQuotes() {
    const data = await this.get('random')
    return data
  }

  async getTechQuoteByKey(id) {
    return this.get(`${encodeURIComponent(id)}`)
  }
}

module.exports = techQuotesAPI
