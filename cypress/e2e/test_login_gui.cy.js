describe('Вход в систему', () => {
  it('используя пользовательский интерфейс', () => {
    // Запускаем страницу входа с явным ожиданием её загрузки
    cy.visit('https://auth.timetta.com')

    // Получаем поле Email и Password по их DOM и вводим значения из виртуального окружения
    cy.get('[name=Email]').type(Cypress.env('login'))
    cy.get('[name=Password]').type(Cypress.env('password'))

    // Находим кнопку Войти и нажимаем на неё
    cy.get('[class="form-group mt-3"]').contains('Войти').click()

//     Проверяем что успешно вошли в систему
    cy.url().should('eq', 'https://app.timetta.com/my/timesheets/current')
  })
})