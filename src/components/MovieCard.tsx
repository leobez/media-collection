import { Link } from "react-router-dom"

type Props = {
    movie: any
}

const POSTER_URL = import.meta.env.VITE_POSTER_URL

const MovieCard = ({movie}: Props) => {

    return (
        
        <>
            <Link to={`/movie/${movie.id}`}>
                <div className='cursor-pointer flex flex-col relative hover:opacity-50 min-w-[208px]'> 
                    <figure className=''>
                        <img src={`${POSTER_URL}/${movie.poster_path}`} alt={movie.title} className='object-cover h-80' loading="lazy"/>
                    </figure>
                    <div className="absolute bottom-0 w-full bg-slate-950 px-2 py-3 text-slate-200 text-ellipsis overflow-hidden whitespace-nowrap">{movie.original_title}</div>
                </div>
            </Link>
        </>

    )
}

export default MovieCard