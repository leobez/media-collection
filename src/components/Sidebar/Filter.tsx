import { useContext, useState } from "react"
import { TMDB_GENRES } from "../../data/TMDB_GENRES"
import { useNavigate } from "react-router-dom"
import MovieContext, { MovieContextType } from "../../context/MovieContext"

const Filter = () => {

    const navigate = useNavigate()

    const GENRES = Object.entries(TMDB_GENRES)

    const [selectedGenres, setSelectedGenres] = useState<number[]>([])

    const {loading, updateMessage} = useContext(MovieContext) as MovieContextType

    const addGenre = (id:number) => {
      setSelectedGenres((prev:any)=>[...prev, id])
    } 

    const removeGenre = (id:number) => {
      setSelectedGenres((prev:any)=>prev.filter((genreId:number)=>genreId!=id))
    } 

    const handleFilter = (e:any):void => {
      e.preventDefault()
      const args = selectedGenres.join(',')
      if (!args || args.length === 0) {
        updateMessage('Select at least one genre to filter', 'orange')
        return;
      }
      navigate(`/bygenre?genres=${args}`)
    }

    const handleRandom = async(e:any):Promise<void> => {
      e.preventDefault()
      const args = selectedGenres.join(',')
      if (!args || args.length === 0) {
        updateMessage('Select at least one genre to randomize', 'orange')
        return;
      }
      navigate(`/random?genres=${args}`)
    }

    const toggleGenre = (e:any):void => {
      e.preventDefault()
      
      const classList:any[] = Object.values(e.target.classList)
      const id = Number(e.target.id)

      //console.log(classList)

      if (classList.includes('unselected')) {
        e.target.classList.remove('unselected')
        e.target.classList.add('selected')
        //console.log('SELECTING: ', id)
        addGenre(id)

      } else if (classList.includes('selected')) {
        e.target.classList.remove('selected')
        e.target.classList.add('unselected')
        //console.log('UNSELECTING: ', id)
        removeGenre(id)

      }
    }

    return (
      <>
        <div className="text-left mb-2 text-white"></div>
        {GENRES && 
            <form>
                <div className="grid grid-cols-2 gap-2 h-64 overflow-y-auto scrollbar-thin pr-2">
                    {GENRES.map((genre:any) => (
                        <button key={genre[0]} className="h-10 rounded-lg text-center p-1 text-xs bg-rose-900 hover:bg-rose-950 text-white cursor-pointer unselected text-ellipsis overflow-hidden whitespace-nowrap " id={genre[0]} onClick={toggleGenre} title={genre[1]}>
                            {genre[1]}
                        </button>
                    ))}
                </div>
                <div className="h-12 flex w-full gap-2 mt-3">

                    {!loading &&
                      <>
                        <button type="submit" className="text-sm w-1/2 bg-rose-900 hover:bg-rose-950 text-white cursor-pointer rounded-lg shadow-lg" onClick={handleFilter}> 
                          Filter 
                        </button>
                        <button type="submit"  className="text-sm w-1/2 bg-rose-900 hover:bg-rose-950 text-white cursor-pointer rounded-lg shadow-lg" onClick={handleRandom}> 
                          Random 
                        </button>
                      </>
                    }

                    {loading &&
                      <>
                        <button type="submit" className="text-sm w-1/2 bg-rose-900 hover:bg-rose-950 text-white cursor-pointer disabled rounded-lg shadow-lg"> 
                          Filter 
                        </button>
                        <button type="submit"  className="text-sm w-1/2 bg-rose-900 hover:bg-rose-950 text-white cursor-pointer disabled rounded-lg shadow-lg"> 
                          Random
                        </button>
                      </>
                    }

                </div>
            </form>
        }
      </>
    )

}

export default Filter