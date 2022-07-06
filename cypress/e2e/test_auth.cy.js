
let user

before (function fetchUser () {
  // отправляем запрос по url с нужным телом и заголовками
  cy.request ({
    method: 'POST',
    url: 'https://auth.timetta.com/connect/token',
    body: {
      'client_id': 'external',
      'scope': 'all offline_access',
      'grant_type': 'password',
      'username': Cypress.env('login'),
      'password': Cypress.env('password'),
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  // получаем тело ответа и сохраняем в переменную
  .its('body')
  .then((res) => {
    user = res
  })
})

// тесты
describe('Вход в систему c токеном', () => {
  it('используя API', () => {
    // отправляем запрос на страницу с требования к токену аутентификации 
    cy.request({
      method: 'GET',
      url: 'https://api.timetta.com/odata/TimeSheets?$apply=filter((userId%20eq%20' +
      'e5abbd70-c398-4276-890f-47181bd3a552)%20and%20(approvalStatus/code%20eq%20%' +
      '27Draft%27)%20and%20(dueDate%20lt%202022-07-06))/aggregate($count%20as%20count)',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // передаём токен
        'Authorization' : 'Bearer ' + user.access_token,
      },
    }).then((response) => {
      // выполняем проверку что статус код 200
      expect(response.status).to.eq(200)
    })

    // повторяем запрос
    cy.request({
      method: 'GET',
      url: 'https://api.timetta.com/odata/TimeSheets?$apply=filter((userId%20eq%20' +
      'e5abbd70-c398-4276-890f-47181bd3a552)%20and%20(approvalStatus/code%20eq%20%' +
      '27Draft%27)%20and%20(dueDate%20lt%202022-07-06))/aggregate($count%20as%20count)',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // здесь токен не передаём
      },
      failOnStatusCode: false,
    }).then((response) => {
      // выполняем проверку что статус код 401
      expect(response.status).to.eq(401)
    })
