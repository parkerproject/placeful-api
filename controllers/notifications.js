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
      const skip = request.query.offset || 0;
      const limit = request.query.limit || 20;
      if (request.query.notification_id) {
        db.notifications.find({
          item_id: request.query.notification_id,
        }, (err, result) => {
          if (err) console.log(err);
          const createdDateOfNotification = (result[0] != null) ? result[0].date_created : '';
          db.notifications.find({
            date_created: {
              $gt: createdDateOfNotification,
            },
          }).sort({
            date_created: -1,
          }, (err, data) => {
            if (err) console.log(err);
            reply({
              results: data,
              total_amount: data.length,
            });
          });
        });
      } else {
        db.notifications.find({}).sort({
          date_created: -1,
        }).skip(skip).limit(limit, (err, results) => {
          if (err) console.log(err);
          reply({
            results,
            total_amount: results.length,
          });
        });
      }
    },
    description: 'get notifications',
    notes: 'get notifications',
    tags: ['api'],
    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        user_id: Joi.string().required().description('id of user'),
        limit: Joi.number().integer().min(1).default(20).description('defaults to 20'),
        offset: Joi.number().integer().description('defaults to 0'),
        notification_id: Joi.string().description('item_id of the notification'),
      },
    },
  },
};
