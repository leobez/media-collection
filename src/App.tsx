import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Genres from './components/Genres'
import Categories from './components/Categories'
import MovieHome from './pages/movie/MovieHome'
import GameHome from './pages/GameHome'

function App() {

    return (
      <>  
        <div className='h-screen flex flex-col'>
          
            <header className='flex-none h-16 p-4 flex justify-between align-middle bg-color05'>
              <Header/>
            </header>

            <BrowserRouter>

              <div className='flex-grow flex gap-1 bg-slate-300 overflow-y-hidden w-9/12 m-auto  shadow-lg'>

                <div className='max-h-full w-44 bg-white border-x-2 border-color05 p-2 overflow-y-scroll scrollbar-thin'>
                  <Genres/>
                </div>

                <main className='max-h-full flex-grow bg-white p-2 overflow-y-auto scrollbar-thin'>

                  <div>
                    <Categories/>
                  </div>

                  <Routes>

                    <Route path='*' element={<div>404</div>}></Route>
                    <Route path='/game' element={<GameHome/>}></Route>
                    <Route path='/movie' element={<MovieHome/>}></Route>

                  </Routes>  

                </main>

              </div>

            </BrowserRouter>
            
            <footer className='flex-none h-16 p-4 grid place-items-center bg-color05'>
              <Footer/>
            </footer>

        </div>

      </>

    )
}

export default App
