// TESTES DE AUTENTICAÇÃO 

const URL = 'http://localhost:5173'

const TIMESTAMP = Date.now()

const USUARIO_VALIDO = {
  nome: 'Usuario Automatizado',
  email: `auto.${TIMESTAMP}@uvv.br`,
  senha: 'Teste123'
}

const EMAIL_NOVO = `novo.${TIMESTAMP + 1}@uvv.br`

function preencherCadastro(nome, email, senha) {
  if (nome)  cy.get('input').eq(0).clear().type(nome,  { force: true, delay: 50 })
  if (email) cy.get('input').eq(1).clear().type(email, { force: true, delay: 50 })
  if (senha) cy.get('input').eq(2).clear().type(senha, { force: true, delay: 50 })
  cy.wait(500)
}

function preencherLogin(email, senha) {
  cy.get('input').eq(0).clear().type(email, { force: true, delay: 50 })
  if (senha) cy.get('input').eq(1).clear().type(senha, { force: true, delay: 50 })
  cy.wait(500)
}

before(() => {
  cy.visit(`${URL}/register`)
  cy.wait(500)
  preencherCadastro(USUARIO_VALIDO.nome, USUARIO_VALIDO.email, USUARIO_VALIDO.senha)
  cy.get('button').contains('Criar conta').click({ force: true })
  cy.wait(3000) 
})

describe('CADASTRO DE USUÁRIO', () => {

  it('Deve aceitar cadastro com email @uvv.br', () => {
    cy.visit(`${URL}/register`)
    preencherCadastro('Usuario Teste', EMAIL_NOVO, 'Teste123')
    cy.get('button').contains('Criar conta').click({ force: true })
    cy.url().should('not.include', '/register')
  })

  it('Deve aceitar cadastro com email @uvvnet.com.br', () => {
    cy.visit(`${URL}/register`)
    preencherCadastro('Usuario Teste', `teste.${Date.now()}@uvvnet.com.br`, 'Teste123')
    cy.get('button').contains('Criar conta').click({ force: true })
    cy.url().should('not.include', '/register')
  })

  it('Deve rejeitar cadastro com email @gmail.com', () => {
    cy.visit(`${URL}/register`)
    preencherCadastro('Usuario Teste', 'invalido@gmail.com', 'Teste123')
    cy.get('button').contains('Criar conta').click({ force: true })
    cy.wait(3000)
    cy.url().should('include', '/register')
  })

  it('Deve rejeitar cadastro sem nome', () => {
    cy.visit(`${URL}/register`)
    preencherCadastro(null, `semnome.${Date.now()}@uvv.br`, 'Teste123')
    cy.get('button').contains('Criar conta').click({ force: true })
    cy.url().should('include', '/register')
  })

  it('Deve rejeitar cadastro sem email', () => {
    cy.visit(`${URL}/register`)
    preencherCadastro('Usuario Teste', null, 'Teste123')
    cy.get('button').contains('Criar conta').click({ force: true })
    cy.url().should('include', '/register')
  })

  it('Deve rejeitar cadastro sem senha', () => {
    cy.visit(`${URL}/register`)
    preencherCadastro('Usuario Teste', `semsenha.${Date.now()}@uvv.br`, null)
    cy.get('button').contains('Criar conta').click({ force: true })
    cy.url().should('include', '/register')
  })

  it('Deve exibir alerta para senha sem letra maiúscula', () => {
    cy.visit(`${URL}/register`)
    cy.get('input').eq(2).type('teste123', { force: true, delay: 50 })
    cy.contains('Uma letra maiúscula').should('be.visible')
  })

  it('Deve exibir alerta para senha sem número', () => {
    cy.visit(`${URL}/register`)
    cy.get('input').eq(2).type('Testeteste', { force: true, delay: 50 })
    cy.contains('Um número').should('be.visible')
  })

})

describe('LOGIN', () => {

  it('Deve fazer login com credenciais corretas', () => {
    cy.visit(`${URL}/login`)
    preencherLogin(USUARIO_VALIDO.email, USUARIO_VALIDO.senha)
    cy.get('button').contains('Entrar').click({ force: true })
    cy.wait(3000)
    cy.url().should('not.include', '/login')
  })

  it('Deve rejeitar login com senha errada', () => {
    cy.visit(`${URL}/login`)
    preencherLogin(USUARIO_VALIDO.email, 'SenhaErrada999')
    cy.get('button').contains('Entrar').click({ force: true })
    cy.wait(3000)
    cy.url().should('include', '/login')
  })

  it('Deve rejeitar login com email não cadastrado', () => {
    cy.visit(`${URL}/login`)
    preencherLogin('nao.existe@uvv.br', 'Teste123')
    cy.get('button').contains('Entrar').click({ force: true })
    cy.wait(3000)
    cy.url().should('include', '/login')
  })

  it('Deve rejeitar login com campos vazios', () => {
    cy.visit(`${URL}/login`)
    cy.get('button').contains('Entrar').click({ force: true })
    cy.url().should('include', '/login')
  })

})