import { useContext, useEffect, useState } from 'react'
import MovieContext, { MovieContextType } from '../context/MovieContext'
import MovieList from '../components/MovieList'
import Button from '../components/Button'

const Upcoming = () => {

    const {GET_movies_upcoming, loading} = useContext(MovieContext) as MovieContextType

    const [list, setList] = useState<any[]>([])
    const [page, setPage] = useState<number>(1)

    useEffect(() => {

      const ASYNC_GET_movies_upcoming = async() => {

        const tempList = await GET_movies_upcoming(page)

        // Inserting into list for first time
        if (list.length === 0) {
          setList(tempList)
        } else {
          setList(prev => [...prev, ...tempList])
        }

      }
      
      ASYNC_GET_movies_upcoming()

    },[page])

    const updatePage = () => {
      setPage(prev => prev+1)
    }

    return (
      <>
        {list && 
          <>
            {list.length > 0 ? (
              <MovieList movieList={list}/>
            ) : (
              <p>No elements found.</p>
            )}
          </>
        }
        <Button text={'Load more'} loading={loading} func={updatePage}/>
      </>
    )
}

export default Upcoming