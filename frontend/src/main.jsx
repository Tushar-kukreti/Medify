import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/userStore.js'
import UserContextProvider from './context/userContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserContextProvider>
      <Provider store={store}> 
        <App />
      </Provider>
    </UserContextProvider> 
  </BrowserRouter>
)
