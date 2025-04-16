'use strict'

exports.config = {
  app_name: ['flights.owenmerry.com'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
  },
  allow_all_headers: true,
  attributes: {
    enabled: true,
  },
}