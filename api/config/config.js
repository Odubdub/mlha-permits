module.exports = {
  'secret': process.env.APP_SECRET,
  'mailer': {
    'port': process.env.APP_MAILER_PORT,
    'host': process.env.APP_MAILER_HOST,
    'user': process.env.APP_MAILER_USER,
    'pass': process.env.APP_MAILER_PASS
  },
  'admin_client_url': process.env.APP_ADMIN_CLIENT_URL,
}