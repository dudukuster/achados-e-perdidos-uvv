
// TESTES PARA VERIFICAR ITENS

const URL = 'http://localhost:5173'
const TIMESTAMP = Date.now()

const USUARIO = {
  nome: 'Testador Itens',
  email: `itens.${TIMESTAMP}@uvv.br`,
  senha: 'Teste123'
}

function login() {
  cy.session(USUARIO.email, () => {
    cy.visit(`${URL}/login`)
    cy.get('input').eq(0).type(USUARIO.email, { force: true, delay: 50 })
    cy.get('input').eq(1).type(USUARIO.senha, { force: true, delay: 50 })
    cy.wait(300)
    cy.get('button').contains('Entrar').click({ force: true })
    cy.url().should('not.include', '/login')
    cy.wait(2000)
  })
}

function irParaPublicar() {
  cy.visit(`${URL}/`)
  cy.url().should('eq', `${URL}/`)
  cy.wait(1500)
  cy.get('button, a').contains('Publicar').should('be.visible')
  cy.get('button, a').contains('Publicar').first().click({ force: true })
  cy.wait(1500)
  cy.url().should('include', '/create')
}

function selecionarCategoria(texto) {
  cy.get('button[role="combobox"]').eq(0).click({ force: true })
  cy.wait(1000)
  cy.get('[role="option"]').contains(texto).click({ force: true })
  cy.wait(500)
}

function selecionarLocal(texto) {
  cy.get('button[role="combobox"]').eq(1).click({ force: true })
  cy.wait(1000)
  cy.get('[role="option"]').contains(texto).click({ force: true })
  cy.wait(500)
}

before(() => {
  cy.visit(`${URL}/register`)
  cy.wait(500)
  cy.get('input').eq(0).type(USUARIO.nome,  { force: true, delay: 50 })
  cy.get('input').eq(1).type(USUARIO.email, { force: true, delay: 50 })
  cy.get('input').eq(2).type(USUARIO.senha, { force: true, delay: 50 })
  cy.wait(300)
  cy.get('button').contains('Criar conta').click({ force: true })
  cy.wait(3000)
})


describe('PUBLICAR ITEM', () => {

  it('Deve publicar item com todos os campos e imagem', () => {
    login()
    irParaPublicar()
    cy.get('input').first().type('Garrafa Stanley Verde', { force: true, delay: 50 })
    cy.get('#description').type('Garrafa Stanley verde encontrada na cantina. Tem o nome escrito na lateral.', { force: true, delay: 50 })
    selecionarCategoria('Acessorios')
    selecionarLocal('Cantina')
    cy.get('#lostDate').type('2026-05-07', { force: true })
    cy.get('input[type="file"]').selectFile('cypress/fixtures/garrafa.webp', { force: true })
    cy.wait(1000)
    cy.contains('button', 'Publicar').last().click({ force: true })
    cy.wait(3000)
    cy.url().should('not.include', '/create')
  })

  it('Deve rejeitar publicação sem imagem', () => {
    login()
    irParaPublicar()
    cy.get('input').first().type('Garrafa Stanley Prata', { force: true, delay: 50 })
    cy.get('#description').type('Garrafa Stanley prata encontrada na biblioteca.', { force: true, delay: 50 })
    selecionarCategoria('Outros')
    selecionarLocal('Biblioteca')
    cy.get('#lostDate').type('2026-05-07', { force: true })
    cy.contains('button', 'Publicar').last().click({ force: true })
    cy.wait(2000)
    cy.url().should('include', '/create')
  })

  
  it('Deve rejeitar publicação sem nome', () => {
    login()
    irParaPublicar()
    cy.get('#description').type('Descrição sem nome', { force: true, delay: 50 })
    cy.contains('button', 'Publicar').last().click({ force: true })
    cy.wait(1000)
    cy.url().should('include', '/create')
  })

  it('Deve rejeitar publicação sem descrição', () => {
    login()
    irParaPublicar()
    cy.get('input').first().type('Item sem descrição', { force: true, delay: 50 })
    cy.contains('button', 'Publicar').last().click({ force: true })
    cy.wait(1000)
    cy.url().should('include', '/create')
  })

  it('Deve rejeitar publicação sem categoria', () => {
    login()
    irParaPublicar()
    cy.get('input').first().type('Item sem categoria', { force: true, delay: 50 })
    cy.get('#description').type('Descrição do item', { force: true, delay: 50 })
    selecionarLocal('Laboratorios')
    cy.get('#lostDate').type('2026-05-07', { force: true })
    cy.contains('button', 'Publicar').last().click({ force: true })
    cy.wait(1000)
    cy.url().should('include', '/create')
  })

  it('Deve rejeitar publicação sem local', () => {
    login()
    irParaPublicar()
    cy.get('input').first().type('Item sem local', { force: true, delay: 50 })
    cy.get('#description').type('Descrição do item', { force: true, delay: 50 })
    selecionarCategoria('Eletronicos')
    cy.get('#lostDate').type('2026-05-07', { force: true })
    cy.contains('button', 'Publicar').last().click({ force: true })
    cy.wait(1000)
    cy.url().should('include', '/create')
  })

})


describe('BUSCA', () => {

  beforeEach(() => login())

  it('Deve mostrar sem resultados ao buscar item inexistente', () => {
    cy.visit(`${URL}/`)
    cy.wait(1000)
    cy.get('input[placeholder*="Buscar"], input[placeholder*="item"], input[placeholder*="categoria"]')
      .first().type('xyzitemquenaoexiste999', { force: true, delay: 50 })
    cy.wait(2000)
    cy.contains('xyzitemquenaoexiste999').should('not.exist')
  })

})

// ============================================
describe('STATUS DO ITEM', () => {

  it('Deve exibir item com status Perdido na listagem', () => {
    login()
    cy.visit(`${URL}/`)
    cy.wait(2000)
    cy.contains('Perdido').should('be.visible')
  })

})