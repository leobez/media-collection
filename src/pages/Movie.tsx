import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetMovieById } from '../hooks/useGetMovieById'
import { useGetMovieByGenres } from '../hooks/useGetMovieByGenres'
import MovieCard from '../components/MovieCard'

const Movie = () => {
    
    const {id} = useParams()

    const prodDetail:any = useRef<HTMLDivElement>()

    const {loading, error, movie} = useGetMovieById(Number(id))

    const {fetchMoviesByGenres, loading:listLoading, error:errorLoading} = useGetMovieByGenres()

    const [similarMovies, setSimilarMovies] = useState<any[]>([])

    useEffect(() => {

        if (!movie) return;

        const fetchAsync = async(original_language:string, genres:any[]) => {
            const similarMovies = await fetchMoviesByGenres(original_language, genres)
            console.log('similar movies: ', similarMovies)
            setSimilarMovies(similarMovies)
        }

        fetchAsync(movie.original_language, movie.genres)

    }, [movie])

    const toggleProdDetail = () => {
        const classNames = prodDetail.current.className.split(' ')
        if (classNames.includes('hidden')) {
            // Make it visible
            prodDetail.current.classList.remove('hidden')
            prodDetail.current.classList.add('block')

        } else if (classNames.includes('block')) {
            // Make it invisible
            prodDetail.current.classList.remove('black')
            prodDetail.current.classList.add('hidden')
        }
    }

    useEffect(() => {
        console.log(movie)
    }, [movie])

    if (loading) {
        return (<div className='loading-spinner'></div>)
    } 

    if (movie) {
        
        return (

            <div className='flex justify-center flex-col overflow-y-scroll scrollbar-thin border-black bg-white gap-4 p-2'>
                
                {/* MOVIE */}
                <div className='flex justify-center gap-4 '>

                    {/* POSTER */}
                    <div className='h-[700px] flex w-2/6'>
                        <img src={`${import.meta.env.VITE_POSTER_URL}/${movie.poster_path}`} alt={movie.title} className='h-full w-full object-cover' />
                    </div>

                    {/* INFORMATION */}
                    <div className='flex flex-col gap-4 w-4/6'>
                        
                        {/* TITLE */}
                        <div className='text-left'>
                            <p title='Title'>{movie.title}</p>
                            <div className='w-full h-[1px] bg-black my-2'></div>
                            <p title='Original title'>{movie.original_title}</p>
                        </div>

                        {/* GENRES */}
                        <div className='flex gap-2'>
                            {movie.genres.map((genre:any) => (
                                <div key={genre.id} className='badge p-3' title='Genres'>{genre.name}</div>
                            ))}
                        </div>
                        
                        {/* OVERVIEW */}
                        <div className='w-[450px] text-justify' >
                            <p title='Overview'>{movie.overview}</p>
                        </div>
                        
                        {/* RELEASE DATE, STATUS AND RUNTIME */}
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                <tr className='text-center'>
                                    <th>Release date</th>
                                    <th>Runtime</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* row 1 */}
                                <tr className='text-center'>
                                    <td>{movie.release_date}</td>
                                    <td>{movie.runtime} min</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* POPULARITY AND VOTE INFO. */}
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                <tr className='text-center'>
                                    <th>Popularity</th>
                                    <th>Vote average</th>
                                    <th>Vote count</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* row 1 */}
                                <tr className='text-center'>
                                    <td>{movie.popularity}</td>
                                    <td>{movie.vote_average}</td>
                                    <td>{movie.vote_count}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        {/* PRODUCTION DETAILS */}
                        <div>
                            <button className='border-2 border-black w-full p-2 hover:bg-black hover:text-white' onClick={toggleProdDetail}>Production details</button>
                            <div className='hidden border-2 border-black p-2 mt-1 text-left' id='prod-detail' ref={prodDetail}>
                                <table className="table">
                                    <tbody>
                                    {/* row 1 */}
                                    <tr>
                                        <td>Budget</td>
                                        <td className='font-bold'>{movie.budget}</td>
                                    </tr>

                                    {/* row 2 */}
                                    <tr>
                                        <td>Revenue</td>
                                        <td className='font-bold'>{movie.revenue}</td>
                                    </tr>

                                    {/* row 3 */}
                                    <tr>
                                        <td>Origin country</td>
                                        <td className='font-bold'>
                                            {movie.origin_country.map((country:string, index:number) => (
                                                <span key={index}>{country} </span>
                                            ))}
                                        </td>
                                    </tr>

                                    {/* row 4 */}
                                    <tr>
                                        <td>Original Language</td>
                                        <td className='font-bold'>{movie.original_language}</td>
                                    </tr>

                                    {/* row 5 */}
                                    <tr>
                                        <td>Production company</td>
                                        <td className='font-bold'>
                                            {movie.production_compan.map((compan:any) => (
                                                <div key={compan.id}>
                                                    <div>{compan.name} [{compan.origin_country}]</div>
                                                    {/* <img src={`${import.meta.env.VITE_POSTER_URL}/${compan.logo_path}`} alt={compan.name} className='h-12 w-12 object-contain'/> */}
                                                </div>
                                        ))}
                                        </td>
                                    </tr>

                                    {/* row 6 */}
                                    <tr>
                                        <td>Production countries</td>
                                        <td className='font-bold'>
                                            {movie.production_countries.map((country:any, index:number) => (
                                                <div key={index}>
                                                    <div>{country.name} [{country.iso_3166_1}]</div>
                                                </div>
                                        ))}
                                        </td>
                                    </tr>   

                                    </tbody>

                                </table>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='w-full h-[1px] bg-black my-2'></div>

                {/* SIMILAR MOVIES */}
                {similarMovies && 
                    <div className='self-start mb-10 w-full'>
                        <p className='text-left my-2'>Similar movies:</p>
                        <div className="overflow-x-auto scrollbar-thin w-full h-80 flex gap-1">
                            {similarMovies.map((similarMovie:any) => (
                                <div className='h-full min-w-56'>
                                    <MovieCard movie={similarMovie}/>
                                </div>
                            ))}
                        </div>
                    </div>
                }

            </div>

        )
    }
    
}

export default Movie