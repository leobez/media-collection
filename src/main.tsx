import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MovieListContextProvider } from './context/MovieContext.tsx'
import { ThemeContextProvider } from './context/ThemeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(

    <ThemeContextProvider>
      <MovieListContextProvider>
        <App />
      </MovieListContextProvider>
    </ThemeContextProvider>

)
