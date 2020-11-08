require('dotenv').config()

module.exports = function (email) {
  return {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Аккаунт успешно создан',
    html: `
      <h1>Добро пожаловать в наш магазин</h1>
      <p>Вы успешно создали аккаунт с ${ email }</p>
      <hr/>
      <a href="${ process.env.BASE_URL }">Магазин курсов</a>
    `,
  }
}
