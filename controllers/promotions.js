require('dotenv').load()
const collections = ['promotions']
const mongojs = require('mongojs')
const db = mongojs.connect(process.env.MONGODB_URL, collections)
const Joi = require('joi')
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  // let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  //
  // let day = days[new Date().getDay()]
  // const areas = ['All New York', 'Astoria', 'Brooklyn', 'Chelsea', 'East Village', 'Financial District', 'Flatiron', 'Gramercy', 'Greenwich Village', "Hell's Kitchen", 'Kips Bay', 'Lower East Side', 'Meatpacking District', 'Midtown East', 'Midtown West', 'Murray Hill', 'NoHo', 'Nolita', 'Park Slope', 'Queens', 'SoHo', 'Theater District', 'TriBeCa', 'Union Square', 'Upper East Side', 'Upper West Side', 'West Village', 'Williamsburg']
module.exports = {
  index: {
    handler: function (request, reply) {
      'use strict'
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data')
      }
      // get user interests and match with promotions tags
      let skip = request.query.offset || 0
      let limit = request.query.limit || 20
      let count = 0
      let day = days[new Date().getDay()]
      let categories = ['Food & Drinks', 'Health & Beauty', 'Events & Activities', 'Shopping']
      let queryObject = {
        merchant_id: {
          $nin: ['pcCxqeV5C5O6OtpEqMhw'] // filter out promos by demo
        }
      }
      if (request.query.cat_id) {
        queryObject.merchant_category = categories[request.query.cat_id]
      }
      if (request.query.merchant_locality && request.query.merchant_locality !== 'All') {
        let area = new RegExp(decodeURIComponent(request.query.merchant_locality), 'i')
        queryObject.merchant_locality = area
      }
      if (request.query.tab === 'today') {
        queryObject.start_date = {
          $lte: new Date().toISOString()
        }
        queryObject.end_date = {
          $gte: new Date().toISOString()
        }
        queryObject.days = new RegExp(day, 'i')
      }
      if (request.query.tab === 'later') {
        queryObject.end_date = {
          $gt: new Date().toISOString()
        }
      }
      if (request.query.geo) {
        let lng = Number(request.query.geo.split(',')[0])
        let lat = Number(request.query.geo.split(',')[1])
        queryObject.loc = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            }
            // $maxDistance: 16093.4 // 10 miles
          }
        }
      }
      db.promotions.count(queryObject, function (err, res) {
        if (err) console.log(err)
        count = res
        db.promotions.find(queryObject).skip(skip).limit(limit, function (err, results) {
          if (err) console.log(err)
          reply({
            results: results,
            total_amount: count
          })
        })
      })
    },
    description: 'View promotions',
    notes: 'view promotions',
    tags: ['api'],
    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        limit: Joi.number().integer().min(1).default(20).description('defaults to 20'),
        offset: Joi.number().integer().description('defaults to 0'),
        geo: Joi.string().description('geo location of promotion, format should be geo=longitude,latitude'),
        user_id: Joi.string().required().description('id of user, we use this to match the right promotions to user'),
        tab: Joi.any().valid('today', 'later').required().description('should be today or later, e.g tab=today'),
        cat_id: Joi.string().description('category_id of promotion, you can find this value in {/categories} endpoint'),
        merchant_locality: Joi.string().description('where promotion is taking place')
      }
    }
  }
}
