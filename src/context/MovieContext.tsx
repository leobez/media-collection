import { createContext, useEffect, useState } from "react";

export type MovieContextType = {
    GET_movies_toprated:()=>Promise<void>;
    GET_movies_popular:()=>Promise<void>;
    GET_movies_upcoming:()=>Promise<void>;
    GET_movies_byquery:(query:string)=>Promise<void>;
    GET_movies_bygenres:(genres:number[])=>Promise<void>;
    GET_movies_similar:(id:number)=>Promise<any>; // Returns list of movies                  
    GET_movie_byid:(id:number)=>Promise<any>; // Returns object of movie                   
    GET_movie_randombygenres:(genres:number[], signal:AbortSignal)=>Promise<number>; // Returns random number id
    updateMessage:(message:string, color:string)=>void;
    updateLoading:()=>void;
    updatePage:()=>void;
    updateCategory:(newCategory:string)=>void;
    updateSort:(sort:string, order:string)=>void;
    updateScrollPos:(scrollPos:number)=>void;
    updateApiKey:(apiKey:string)=>void;
    resetStates:()=>void;
    scrollPos:number;
    message:any;
    loading:boolean;
    page:number;
    list:any[];
    run:boolean;
    apiKey:string|null;
}

const MovieContext = createContext<MovieContextType|null>(null)

export const MovieListContextProvider = ({children}:any) => {

    const [apiKey, setApiKey] = useState<string|null>(localStorage.getItem('tmdbApiKey') !== null ? localStorage.getItem('tmdbApiKey') : '')
    //const API_KEY = import.meta.env.VITE_API_KEY
    const URL_TOPRATED = import.meta.env.VITE_TOP_RATED_MOVIES_URL
    const URL_POPULAR = import.meta.env.VITE_POPULAR_MOVIES_URL
    const URL_UPCOMING = import.meta.env.VITE_UPCOMING_MOVIES_URL
    const URL_BYQUERY = import.meta.env.VITE_QUERY
    const URL_SIMILAR = import.meta.env.VITE_SIMILAR
    const URL_BY_GENRES = import.meta.env.VITE_DISCOVER
    const URL_BYID = import.meta.env.VITE_FIND_BY_ID

    const [loading, setLoading]     = useState<boolean>(false)
    const [message, setMessage]     = useState<any>(null)
    const [page, setPage]           = useState<number>(0)
    const [category, setCategory]   = useState<string>('')
    const [list, setList]           = useState<any[]>([])
    const [run, setRun]             = useState<boolean>(false)
    const [sort, setSort]           = useState<string[]>([])//Only used on GET_movies_bygenres
    const [scrollPos, setScrollPos] = useState<number>(0)

    useEffect(() => {

        if (!apiKey || !apiKey.length) return;

        resetStates()

        const testApiKey = async() => {
            try {
                // Test if api key works
                const URL = `${URL_TOPRATED}?api_key=${apiKey}&page=1`
                const RESULT = await fetch(URL)
                const DATA = await RESULT.json()
                //console.log(DATA)
                if (DATA.status_code === 7) {
                    // failed
                    updateMessage('Api Key invalid', 'red')
                    setApiKey('')
                    return;
                } else {
                    localStorage.setItem('tmdbApiKey', `${apiKey}`)
                    updateMessage('API key detected on Local Storage', 'green')
                    return;
                }
            } catch (error) {
                return false
            }
        }

        testApiKey()

    }, [apiKey])
    
    useEffect(() => {
        setScrollPos(0)
        setList([])
        setPage(1)
        // Triggers function that gets data. Always triggers when category is changed, which always means first call
        setRun((prev:boolean) => !prev) 
    }, [category])

    useEffect(() => {
        setScrollPos(0)
        setList([])
        setPage(1)
        setRun((prev:boolean) => !prev) 
    }, [sort])

    // Used for when selecting random movie
    const sleep = (ms:number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Always used when making API calls
    const resetStates = ():void => {
        setLoading(false)
        setMessage(null)
    }

    // -- API CALLS -- //
    const GET_movies_toprated = async():Promise<any> => {
        
        resetStates()

        const API_KEY = localStorage.getItem('tmdbApiKey')

        if (!API_KEY) {
            updateMessage('No api Key', 'red')
            return;
        }

        try {

            setLoading(true)
            const URL = `${URL_TOPRATED}?api_key=${API_KEY}&page=${page}`
            const RESULT = await fetch(URL)
            const DATA = await RESULT.json()
            //console.log('DATA RECEIVED: ', DATA)

            // Validate data
            if (DATA.results.length === 0) {
                setLoading(false)
                updateMessage('No data', 'orange')
                return;
            }
            
            // Filtering only for movies that have a poster to show. 
            let filteredData:any = []
            for (let movie of DATA.results) {
                if (movie.poster_path && movie.overview) {
                    filteredData.push(movie)
                }
            }

            setLoading(false)
            // Inserting into list for first time
            if (list.length === 0) {
                setList(filteredData)
            } else {
                setList(prev => [...prev, ...filteredData])
            }

        } catch (error) {
            setLoading(false)
            updateMessage("Something went wrong", 'red')
            //console.log(error)
            return;
        }

    }

    const GET_movies_popular = async():Promise<any> => {

        resetStates()

        const API_KEY = localStorage.getItem('tmdbApiKey')

        if (!API_KEY) {
            updateMessage('No api Key', 'red')
            return;
        }

        try {

            setLoading(true)
            const URL = `${URL_POPULAR}?api_key=${API_KEY}&page=${page}`
            const RESULT = await fetch(URL)
            const DATA = await RESULT.json()
            //console.log('DATA RECEIVED: ', DATA)

            // Validate data
            if (DATA.results.length === 0) {
                setLoading(false)
                updateMessage('No data', 'orange')
                return;
            }
            
            // Filtering only for movies that have a poster to show.
            let filteredData:any = []
            for (let movie of DATA.results) {
                if (movie.poster_path) {
                    filteredData.push(movie)
                }
            }

            setLoading(false)
            // Inserting into list for first time
            if (list.length === 0) {
                setList(filteredData)
            } else {
                setList(prev => [...prev, ...filteredData])
            }

        } catch (error) {
            setLoading(false)
            //console.log(error)
            updateMessage("Something went wrong", 'red')
            return;
        }

    }

    const GET_movies_upcoming = async():Promise<any> => {

        resetStates()

        const API_KEY = localStorage.getItem('tmdbApiKey')

        if (!API_KEY) {
            updateMessage('No api Key', 'red')
            return;
        }

        try {

            setLoading(true)
            const URL = `${URL_UPCOMING}?api_key=${API_KEY}&page=${page}`
            const RESULT = await fetch(URL)
            const DATA = await RESULT.json()
            //console.log('DATA RECEIVED: ', DATA)

            // Validate data
            if (DATA.results.length === 0) {
                setLoading(false)
                updateMessage('No data', 'orange')
                return;
            }
            
            // Filtering only for movies that have a poster to show.
            let filteredData:any = []
            for (let movie of DATA.results) {
                if (movie.poster_path) {
                    filteredData.push(movie)
                }
            }

            setLoading(false)
            // Inserting into list for first time
            if (list.length === 0) {
                setList(filteredData)
            } else {
                setList(prev => [...prev, ...filteredData])
            }

        } catch (error) {
            setLoading(false)
            //console.log(error)
            updateMessage("Something went wrong", 'red')
            return;
        }

    }

    const GET_movies_byquery = async(query:string):Promise<any> => {

        resetStates()

        const API_KEY = localStorage.getItem('tmdbApiKey')

        if (!API_KEY) {
            updateMessage('No api Key', 'red')
            return;
        }

        try {

            setLoading(true)

            // Validate query
            if (!query || query.length === 0) {
                //console.log('invalid query')
                setLoading(false)
                updateMessage('Invalid query', 'orange')
                return;
            }
            if (query.length > 40) {
                setLoading(false)
                updateMessage('Max. query length is 40', 'orange')
                return;
            }

            const URL = `${URL_BYQUERY}/movie?query=${query}&api_key=${API_KEY}&page=${page}`
            const RESULT = await fetch(URL)
            const DATA = await RESULT.json()
            //console.log('DATA RECEIVED: ', DATA)

            // Validate data
            if (DATA.results.length === 0) {
                setLoading(false)
                updateMessage('No data', 'orange')
                return;
            }
            
            // Filtering only for movies that have a poster to show.
            let filteredData:any = []
            for (let movie of DATA.results) {
                if (movie.poster_path) {
                    filteredData.push(movie)
                }
            }

            setLoading(false)
            // Inserting into list for first time
            if (list.length === 0) {
                setList(filteredData)
            } else {
                setList(prev => [...prev, ...filteredData])
            }

        } catch (error) {
            setLoading(false)
            //console.log(error)
            updateMessage("Something went wrong", 'red')
            return;
        }

    }

    // This one is sortable
    const GET_movies_bygenres = async(genres:number[]):Promise<any> => {

        resetStates()

        const API_KEY = localStorage.getItem('tmdbApiKey')

        if (!API_KEY) {
            updateMessage('No api Key', 'red')
            return;
        }

        let URL = ''

        if (sort[0] && sort[1] && sort[0].length && sort[1].length) {
            URL = `${URL_BY_GENRES}/movie?api_key=${API_KEY}&with_genres=${genres?.join(',')}&page=${page}&sort_by=${sort[0]}.${sort[1]}`
        } else {
            URL = `${URL_BY_GENRES}/movie?api_key=${API_KEY}&with_genres=${genres?.join(',')}&page=${page}`
        }

        //console.log('URL: ', URL)

        try {

            setLoading(true)

            // Validate query
            if (!genres || (genres.length === 1 && genres[0]===0)) {
                setLoading(false)
                updateMessage('Invalid genres', 'orange')
                return;
            }

            const RESULT = await fetch(URL)
            const DATA = await RESULT.json()
            //console.log('DATA RECEIVED: ', DATA)

            // Validate data
            if (DATA.results.length === 0) {
                setLoading(false)
                updateMessage('No data', 'orange')
                return;
            }
            
            // Filtering only for movies that have a poster to show.
            let filteredData:any = []
            for (let movie of DATA.results) {
                if (movie.poster_path) {
                    filteredData.push(movie)
                }
            }

            setLoading(false)
            // Inserting into list for first time
            if (list.length === 0) {
                setList(filteredData)
            } else {
                setList(prev => [...prev, ...filteredData])
            }

        } catch (error) {
            setLoading(false)
            //console.log(error)
            updateMessage("Something went wrong", 'red')
            return;
        }

    }

    const GET_movies_similar = async(id:number):Promise<any> => {

        resetStates()

        const API_KEY = localStorage.getItem('tmdbApiKey')

        if (!API_KEY) {
            updateMessage('No api Key', 'red')
            return;
        }

        try {

            setLoading(true)
            const URL = `${URL_SIMILAR}/${id}/similar?api_key=${API_KEY}`
            const RESULT = await fetch(URL)
            const DATA = await RESULT.json()
            //console.log('DATA RECEIVED: ', DATA)

            // Validate data
            if (DATA.results.length === 0) {
                setLoading(false)
                return;
            }
            
            // Filtering only for movies that have a poster to show.
            let filteredData:any = []
            for (let movie of DATA.results) {
                if (movie.poster_path) {
                    filteredData.push(movie)
                }
            }

            //console.log('filteredData: ', filteredData)
            setLoading(false)

            return filteredData

        } catch (error) {
            setLoading(false)
            //console.log(error)
            updateMessage("Something went wrong", 'red')
            return;
        }

    }

    const GET_movie_byid = async(id:number):Promise<any> => {

        resetStates()

        const API_KEY = localStorage.getItem('tmdbApiKey')

        if (!API_KEY) {
            updateMessage('No api Key', 'red')
            return;
        }

        try {

            setLoading(true)
            const URL = `${URL_BYID}/${id}?api_key=${API_KEY}`
            const RESULT = await fetch(URL)
            const DATA = await RESULT.json()
            //console.log('DATA RECEIVED: ', DATA)

            // Validate data
            if (!DATA) {
                setLoading(false)
                updateMessage('No data', 'orange')
                return;
            }

            setLoading(false)
            return DATA

        } catch (error) {
            setLoading(false)
            //console.log(error)
            updateMessage("Something went wrong", 'red')
            return;
        }

    }

    const GET_movie_randombygenres = async(genres:number[], signal:AbortSignal):Promise<any> => {

        resetStates()

        const API_KEY = localStorage.getItem('tmdbApiKey')

        if (!API_KEY) {
            updateMessage('No api Key', 'red')
            return;
        }

        try {

            let moviePool:any[] = []

            setLoading(true)

            for (let page=1; page<=5; page++) {

                const URL = `${URL_BY_GENRES}/movie?api_key=${API_KEY}&with_genres=${genres?.join(',')}&page=${page}`
                const RESULT = await fetch(URL, {signal})
                //console.log('RESULT: ', RESULT)
                const DATA = await RESULT.json()

                // Last page reached
                if (DATA.results.length === 0) {
                    break;
                }

                // Filtering only for movies that have a poster to show.
                let filteredData:any = []
                for (let movie of DATA.results) {
                    if (movie.poster_path) {
                        filteredData.push(movie)
                    }
                }

                for (let movie of filteredData) {
                    moviePool.push(movie)
                }
            }
            
            //console.log('MOVIE POOL: ', moviePool)

            if (moviePool.length === 0) {
                setLoading(false)
                updateMessage('No data', 'orange')
                return;
            }

            const max = (moviePool.length-1)
            const min = 0
            const randomNum = Math.floor(Math.random() * (max - min + 1) + min)
            await sleep(3000);

            setLoading(false)

            return moviePool[randomNum].id

        } catch {
            setLoading(false)
            //console.log(error)
            updateMessage("Something went wrong", 'red')
            return;
        }
    }

    // UTILS
    const updateMessage = (message:string, color:string):void => {
        setMessage({message, color})
    }
    
    const updateLoading = ():void => {
        setLoading((prev:boolean)=>!prev)
    }

    const updatePage = ():void=>{
        setPage((prev)=>prev+1)
        setRun((prev:boolean) => !prev)
    }

    const updateCategory = (newCategory:string):void=>{
        setCategory(newCategory)
    }

    const updateSort = (sort:string, order:string):void => {
        setSort([sort, order])
    }

    const updateScrollPos = (scrollPos:number):void => {
        setScrollPos(scrollPos)
    }

    const updateApiKey = (apiKey:string):void => {
        setApiKey(apiKey)
    }

    return (
        <MovieContext.Provider value={
                {
                    GET_movies_toprated,
                    GET_movies_popular,
                    GET_movies_upcoming,
                    GET_movies_byquery,
                    GET_movies_bygenres,
                    GET_movies_similar,
                    GET_movie_byid,
                    GET_movie_randombygenres,
                    updateMessage,
                    updateLoading,
                    updatePage,
                    updateCategory,
                    updateSort,
                    updateScrollPos,
                    updateApiKey,
                    resetStates,
                    scrollPos,
                    message,
                    loading,
                    page,
                    list,
                    run,
                    apiKey,
                }
            }>

            {children}

        </MovieContext.Provider>
    )

}

export default MovieContext