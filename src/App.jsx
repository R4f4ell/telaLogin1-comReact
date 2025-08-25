import LoginForm from './components/LoginForm'

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Pular para o conteúdo</a>

      <main id="main" role="main" className="App" aria-label="Área principal">
        <LoginForm />
      </main>
    </>
  )
}