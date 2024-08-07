import { useContext, useState } from 'react'
import MovieContext, { MovieContextType } from '../context/MovieContext'
import { useNavigate } from 'react-router-dom'
import ThemeContext, { ThemeContextType } from '../context/ThemeContext'

const Api = () => {

    const [apiKey, setApiKey] = useState<string>('')

    const {updateApiKey, updateMessage} = useContext(MovieContext) as MovieContextType 
    const {theme} = useContext(ThemeContext) as ThemeContextType 

    const navigate = useNavigate()

    const handleSave = (e:any):void => {
        e.preventDefault()
        if (!apiKey.length) {
            updateMessage("No API key added", 'orange')
            return;
        }
        updateApiKey(apiKey)
        setTimeout(() => navigate('/'), 1000)
    }

    const handleRemove = (e:any):void => {
        e.preventDefault()
        updateApiKey('')
        localStorage.removeItem('tmdbApiKey')
        updateMessage('Api key cleared from Local Storage', 'green')
    }

    return (
        <div className={`bg-${theme}-700 p-5 rounded-lg shadow-lg`}>
            <form className='flex flex-col gap-3 text-left text-sm'>
                <div className='text-white text-sm'>
                    The Api Key will be saved on local storage.
                </div>
                <div className='text-white text-sm'>
                    Link to get an Api Key: 
                    <a href="https://developer.themoviedb.org/v4/reference/intro/getting-started" target='_blank' className={`text-${theme}-300 hover:text-${theme}-500 duration-200`}>
                        TMDB Get an API Key.
                    </a>
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="api_key" className='text-left text-white text-sm'>Enter the key here to use this app: </label>
                    <input type="text" name="api_key" id="api_key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className='bg-white outline-none shadow-lg rounded-lg px-2 py-2'/>
                </div>
                <div className='flex gap-2 justify-center w-1/2'>
                    <button onClick={handleSave} className={`p-3 text-sm w-1/2 bg-${theme}-900 hover:bg-${theme}-950 text-white cursor-pointer rounded-lg shadow-lg`}>Save it</button>
                    <button onClick={handleRemove} className={`p-3 text-sm w-1/2 bg-${theme}-900 hover:bg-${theme}-950 text-white cursor-pointer rounded-lg shadow-lg`}>Clear it</button>
                </div>
            </form>
        </div>
    )
}

export default Api