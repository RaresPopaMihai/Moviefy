import React from 'react'
import Youtube from './Youtube'

function Popup({ selected, closePopup, videoId }) {
	
	return (
		<section className="popup">
			<div className="content">
				<h2>{ selected.Title } <span>({ selected.Year })</span></h2>
				<p className="rating">Rating: {selected.imdbRating}</p>
			{(selected.Director !="N/A") ? 	<p className="rating">Director: {selected.Director} </p>:false}
			{(selected.Production !="N/A") ? 	<p className="rating">Production: {selected.Production} </p>:false}
				<div className="plot">
					<img src={selected.Poster} />
					<p>{selected.Plot}</p>
					<p>Actors: {selected.Actors}</p>
				</div>
				<button className="close" onClick={closePopup}>Close</button>
				<Youtube className="youtube" videoId={videoId}/>
			</div>
		</section>
	)
}

export default Popup