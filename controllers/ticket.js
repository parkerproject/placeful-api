require('dotenv').load()
const collections = ['tickets']
const mongojs = require('mongojs')
const db = mongojs.connect(process.env.MONGODB_URL, collections)
const Joi = require('joi')
const _ = require('lodash')

module.exports = {
  index: {
    handler: function (request, reply) {
      'use strict'

      if (!request.payload.key || request.payload.key != process.env.API_KEY) {
        reply('You need an api key to access data')
      }

      db.tickets.find({
        ticket_id: request.payload.ticket_id,
        user_id: request.payload.user_id
      }).limit(1, (err, result) => {
        if (err) console.log(err)
        if (result.length == 0) {
          db.tickets.save(request.payload, () => {
            reply({
              message: 'ticket saved',
              status: 1
            })
          })
        }
      })

    },

    description: 'Join list',
    notes: 'User gets ticket by joining list',
    tags: ['api'],

    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        ticket_id: Joi.string().required().description('id of a ticket'),
        user_id: Joi.string().required().description('id of a user'),
        title: Joi.string().required().description('title of ticket'),
        person_name: Joi.string().required().description('name of person'),
        date: Joi.string().required().description('ticket date'),
        address: Joi.string().required().description('address on ticket'),
        fine_print: Joi.string().required().description('fine print on ticket')
      }
    }

  }

}