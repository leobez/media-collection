import { useSearchParams } from "react-router-dom"
import MovieList from "../components/MovieList"
import { useContext, useEffect, useRef } from "react"
import MovieContext, { MovieContextType } from "../context/MovieContext"
import Button from "../components/Button"
import Loading from "../components/Loading"
import { useInitialLoading } from "../hooks/useInitialLoading"

const Search = () => {

    const {updateCategory, GET_movies_byquery, updatePage:updatePageC, page, loading, list, run} = useContext(MovieContext) as MovieContextType

    const [params] = useSearchParams()
    const isInitialMount = useRef(true);

    // UPDATE CATEGORY -> RESETS LIST AND PAGE.
    useEffect(() => {
      updateCategory(`byquery?q=${params.get('q')}`)
    }, [params])

    // Initial loading
    const {initialLoading} = useInitialLoading(list)

    useEffect(() => {

      // Only run this effect if page has actually changed
      if (isInitialMount.current) {
        console.log('blocked: ref')
        isInitialMount.current = false
        return;
      } 
      if (!page) {
        console.log('blocked: page')
        return;
      } 

      console.log('running ASYNC_GET_movies_byquery')
      const ASYNC_GET_movies_byquery = async() => {
        const query = params.get('q')
        if (!query) return;

        await GET_movies_byquery(query)
      }
  
      ASYNC_GET_movies_byquery()

    }, [page, run])

    const updatePage = () => {
      updatePageC()
    }

    if (initialLoading) {
      return (
        <Loading message="Initial loading ..."/>
      )
    }

    return (
      <>

        <div className="py-3 text-left text-lg border-b-2 mb-2 border-color05 text-ellipsis overflow-hidden whitespace-nowrap">
          {params && <>Query: {params.get('q')}</>}
        </div>

        {list &&
          <>
            {list.length > 0 ? (
              <MovieList movieList={list}/>
            ) : (
              <p>No elements found.</p>
            )}
          </>
        }
        <div className="my-4 mr-2 flex justify-end text-sm">
          <Button text={'Load more +'} loading={loading} func={updatePage}/>
        </div>
      </>
    )
}

export default Search