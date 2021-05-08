import React from 'react'

function Youtube({videoId}) {
    const srcVideo="https://www.youtube.com/embed/"+videoId
    return(
        <div>
        <iframe padding-left="300px"width="600px" height="315" src={srcVideo} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        
        )
        
}

export default Youtube