import App from './App'
import store from './store/index'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'

const Wrapper = ({ children }) => (
  // As your component uses your Redux state, you need to wrap it with a Provider
  // https://stackoverflow.com/questions/68822417
  <Provider store={store}>{children}</Provider>
)

test('renders learn react link', () => {
  render(<App />, { wrapper: Wrapper })
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
