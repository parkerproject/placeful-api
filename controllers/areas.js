require('dotenv').load();
const db = require('../helpers/db');
const Joi = require('joi');
module.exports = {
  index: {
    handler(request, reply) {
      'use strict';
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }
      db.neighborhood.find({}, function (err, results) {
        if (err) console.log(err);
        reply({
          results,
        });
      });
    },
    description: 'neighborhood',
    notes: 'neighborhood',
    tags: ['api'],
    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        user_id: Joi.string().required().description('id of user'),
      },
    },
  },
};
