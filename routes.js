var requireDirectory = require('require-directory')

module.exports = function (server) {
  var controller = requireDirectory(module, './controllers')

  // Array of routes for Hapi
  var routeTable = [{
    method: 'GET',
    path: '/images/{path*}',
    config: controller.assets.images
  }, {
    method: 'GET',
    path: '/css/{path*}',
    config: controller.assets.css
  }, {
    method: 'GET',
    path: '/js/{path*}',
    config: controller.assets.js
  }, {
    method: 'GET',
    path: '/video/{path*}',
    config: controller.assets.video
  }, {
    method: 'GET',
    path: '/promotions',
    config: controller.promotions.index
  }, {
    method: 'GET',
    path: '/promotions/filter',
    config: controller.filter.index
  }, {
    method: 'GET',
    path: '/promotion',
    config: controller.promotion.index
  }, {
    method: 'POST',
    path: '/promotion/like',
    config: controller.promotion_like.index
  }, {
    method: 'DELETE',
    path: '/promotion/unlike',
    config: controller.promotion_unlike.index
  }, {
    method: 'GET',
    path: '/places',
    config: controller.places.index
  }, {
    method: 'GET',
    path: '/place',
    config: controller.place.index
  }, {
    method: 'GET',
    path: '/place/promotions',
    config: controller.place_promotions.index
  }, {
    method: 'POST',
    path: '/place/follow',
    config: controller.follow.index
  }, {
    method: 'DELETE',
    path: '/place/unfollow',
    config: controller.unfollow.index
  }, {
    method: 'GET',
    path: '/interests',
    config: controller.interests.index
  }, {
    method: 'POST',
    path: '/interests/user',
    config: controller.interests_user.index
  }, {
    method: 'GET',
    path: '/user/places',
    config: controller.user_places.index
  }, {
    method: 'GET',
    path: '/user/likes',
    config: controller.user_likes.index
  }, {
    method: 'GET',
    path: '/notifications',
    config: controller.notifications.index
  }, {
    method: 'GET',
    path: '/place/reviews',
    config: controller.reviews.index
  }, {
    method: 'GET',
    path: '/user/tickets',
    config: controller.tickets.index
  }, {
    method: 'POST',
    path: '/user/ticket',
    config: controller.ticket.index
  }, {
    method: 'GET',
    path: '/user/ticket',
    config: controller.user_ticket.index
  }, {
    method: 'POST',
    path: '/email/welcome',
    config: controller.email.welcome
  }, {
    method: 'POST',
    path: '/email/ticket',
    config: controller.email.ticket
  }]
  return routeTable
}
