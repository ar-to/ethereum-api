/**
 * Used by pm2
 */
module.exports = {
  apps : [{
    name   : "API",
    script : "./bin/www",
    watch  : true,
    log_date_format : "YYYY-MM-DD HH:mm Z"
  }]
}
