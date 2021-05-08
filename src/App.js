import React, { useState } from 'react'
import axios from 'axios'

import Search from './components/Search'
import Results from './components/Results'
import Popup from './components/Popup'

function App() {
  const [state, setState] = useState({
    s: "",
    results: [],
    selected: {}
  });
  const apiurl = "https://www.omdbapi.com/?apikey=dfe6d885";
  const APIYT = 'AIzaSyB3iOuJkCl_0uVKQXECVIPudQ9i5P9tDLU'
  const YTURL = `https://www.googleapis.com/youtube/v3/search?key=${APIYT}`

  const search = (e) => {
    if (e.key === "Enter") {
      axios(apiurl + "&s=" + state.s).then(({ data }) => {
        console.log(data)
        let results = data.Search;
        console.log(results)

        setState(prevState => {
          return { ...prevState, results: results }
        })
      });
    }
  }
  
  const handleInput = (e) => {
    let s = e.target.value;

    setState(prevState => {
      return { ...prevState, s: s }
    });
  }

  const openPopup = id => {
    axios(apiurl + "&i=" + id).then(({ data }) => {
      let result = data;
      console.log(result);
      
      console.log(YTURL + "&q="+result.Title+" Trailer"+"&maxResults=1")
      axios(YTURL + "&q="+result.Title+" Trailer"+"&maxResults=1").then(({data}) =>{
        let videoResult = data.items[0].id.videoId;
        
        console.log(videoResult);
        
        setState(prevState => {
        return { ...prevState, selected: result, vidId: videoResult }
      });
        
      })

      
    });
    
    
  }

  const closePopup = () => {
    setState(prevState => {
      return { ...prevState, selected: {} }
    });
  }

  return (
    <div className="App">
      <header>
        <h1>Moviefy</h1>
      </header>
      <main>
        <Search handleInput={handleInput} search={search} />

        {(typeof state.results !="undefined") ? <Results results={state.results} openPopup={openPopup} /> : <h3 className="movieError"> Movie Not Found!</h3>}

        {(typeof state.selected.Title != "undefined") ? <Popup selected={state.selected} closePopup={closePopup} videoId={state.vidId} /> : false}
      </main>
    </div>
  );
}

export default App