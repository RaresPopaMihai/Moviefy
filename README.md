# Moviefy - Aplicatie web de cautare filme/seriale

## Introducere
Moviefy este o aplicatie web dezvoltata in **reactJS

Permite utilizatorilor sa caute filme sau seriale si sa afle mai multe detalii despre ele precum :

- **Rating**
- **Director**
- **Anul lansarii**
- **Actorii**
- **Productia**

Pe langa detaliile filmului, utilizatorul mai are la dispozitie si **trailer-ul filmului/serialului**

## Descriere problemă 
Aplicatia isi propune de a pune la dispozitie utilizatorilor informatii interesante/utile si un trailer, totul in acelasi loc.
Pentru acest lucru nu este nevoie o autentificare a userului sau o stocare a anumitor date personale sau alte interactiune ce tin de partea de **server**.
Avand toate aceste lucruri in vedere, cea mai buna solutie este aceea a unei ***aplicatii web statice***

O aplicatie web statica se refera la orice aplicatie care se poate livra utilizatorului final in browser, informatia din HTML, CSS sau Javascript ne mai fiind modificata pe server-side.

Aplicatiile web statice vin cu o serie de avantaje:
- Performanta sporita pentru utilizator in comparatie cu aplicatiile dinamice
- Putine/Fara dependente pentru sistem precum bazele de date sau alte servere
- Costuri reduse, utilizand servicii cloud, in comparatie cu mediile de dezvoltare hostate
- Setarile de securitate sunt usor de facut si mult mai eficiente

### Structura Aplicatiei
Aplicatia este de tip Single Page Application.
Pagina contine:
- Un header cu titlul aplicatiei
- Un input in care utilizatorul poate cauta rezultatele
- Rezultatele afisate in urma cautarii, afisand denumirea rezultatului si posterul

In momentul in care utilizatorul introduce de la tastatura ce doreste sa caute si apoi apasa enter, se face un request de tip GET prin axios, folosind API-ul **OMDB**(The Open Movie Database).

In momentul in care utilizatorul da click pe un rezultat se va deschide un pop-up in care sunt afisate detaliile filmului, _mai sus mentionate_. Tot atunci, in momentul in care este deschis pop-up-ul se face un request de tip GET prin axios, folosind API-ul **Youtube Data V3**, pentru a returna trailer-ul filmului.

## Descrierea API-urilor folosite
### The Open Move Database
**OMDb API** este un serviciu web de tip REST folosit pentru a extrage informatii utile despre filme sau seriale.
#### Mod de utilizare
Pentru a utiliza acest API este necesar un API Key pentru care se face o cerere.
Acest API Key este esential deoarece este un parametru pentru request-ul de tip GET 

```javascript
const apiurl = "https://www.omdbapi.com/?apikey=dfe6d885";
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
 ```
 Pentru partea de cautare din acest API se pot utiliza mai multi parametrii:
 | Parametru    | Necesar       | Optiuni valide           | Valoare initiala | Descriere                   |
| ------------- |:-------------:|:------------------------:| ----------------:| ----------------------------|
| s             | yes           |                          | <empty>          | Titlul cautarii             |
| type          | no            |   filme,seriale,episoade | <empty>          | Tipul intors de request     |
| y             | no            |                          | <empty>          | Anul lansarii               |
| r             | no            |    json,xml              | json             | Tipul datelor intoarse      |
| page          | no            |    1-100                 | 1                | Numarul de pagini returnate |
| callback      | no            |                          | <empty>          | Numele callback-ului JSONP  |
| v             | no            |                          | <empty>          | Versiunea API-ului          |

 In acest caz s-a folosit numai parametrul **s** pentru cautarea titlului
 In urma acestui request se va stoca lista rezultatelor cautarii. In cazul in care nu s-au gasit rezultate se va afisa un mesaj in acest sens
 
 In metoda openPopup s-a mai creat un request de tip GET cu parametrul **i** luat din selectia userului, ce va intoarce un obiect json cu toate detaliile importante ale selectiei
 ```javascript
 axios(apiurl + "&i=" + id).then(({ data }) => {
      let result = data;
      console.log(result);
 ```
 
 ![alt text](https://github.com/RaresPopaMihai/Moviefy/blob/master/pics/Main%20Page.JPG "Pagina Principala")
 
 **Fara Rezultat**:
 
  ![alt text](https://github.com/RaresPopaMihai/Moviefy/blob/master/pics/Main%20Page%20-%20No%20Result.JPG "Pagina Principala Fara Rezultat")

### Youtube Data V3
**YouTube Data API** permite incorporarea functiilor pe care utilizatorii le folosesc pe Youtube in pagina web personala.
#### Mod de utilizare
In cazul acestei aplicatii a fost utilizata functia de search, pentru a obtine trailer-ul selectiei
Ca si in cazul API-ului OMDB, este necesar un **API key** pentru a putea fi utilizat
```javascript
const APIYT = 'AIzaSyB3iOuJkCl_0uVKQXECVIPudQ9i5P9tDLU'
const YTURL = `https://www.googleapis.com/youtube/v3/search?key=${APIYT}`
const openPopup = id => {
    var result
    var videoResult
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
        
      }).catch(err =>{
         setState(prevState => {
        return { ...prevState, selected: result, vidId: undefined }
      });
      })
    }); 
  }
```
In cadrul functiei ce se apeleaza in momentul deschiderii popUp-ului, se face un request de tip GET catre Youtube ce va contine **API key-ul** , **numele selectiei** urmat de cuvantul **_Trailer_** si parametrul **maxResults=1** care ne permite sa intoarcem doar un singur rezultat in lista.

In cazul in care nu exista trailer pentru selectie sau numarul maxim de request-uri pe zi ( versiunea gratis a API-ului) a fost depasit, un mesaj **Trailer is not available!** se va afisa.

**Din raspuns se va selecta din id, videoId ce contine ID-ul videclipului ce va fii pus in url-ul: ```javascript https://www.youtube.com/watch?v=... ``` in parametrul v ce va fii utilizat de un iframe pentru a afisa videoclipul**

Acest API are mai multi parametrii ce pot fi utilizati:
```json
{
  "kind": "youtube#searchResult",
  "etag": etag,
  "id": {
    "kind": string,
    "videoId": string,
    "channelId": string,
    "playlistId": string
  },
  "snippet": {
    "publishedAt": datetime,
    "channelId": string,
    "title": string,
    "description": string,
    "thumbnails": {
      (key): {
        "url": string,
        "width": unsigned integer,
        "height": unsigned integer
      }
    },
    "channelTitle": string,
    "liveBroadcastContent": string
  }
}
```
**Afisare Pop-up:**
![alt text](https://github.com/RaresPopaMihai/Moviefy/blob/master/pics/Pop-up.JPG "Pop-up")

## Flux de date
In aceasta aplicatie statica, datele circula numai intre cele 2 API-uri si Aplicatie.
- Aplicatia trimite un request GET catre OMDB pentru lista de filme/seriale ce se regasesc in cautarea utilizatorului
- OMDB raspunde cu lista, in cazul in care exista
- Aplicatia trimite un request GET catre Youtube Data V3 pentru lista cu un singur rezultat pentru url-ul videoclipului
- Youtube Data V3 raspunde cu lista, in cazul in care exista sau maximul zilnic nu a fost depasit

![alt text](https://github.com/RaresPopaMihai/Moviefy/blob/master/pics/Flux%20date.JPG "Flux de date")
## Referinte

[OMDB API](https://www.omdbapi.com/)

[Youtube Data V3 Search API](https://developers.google.com/youtube/v3/docs/search)

[Aplicatii Web Statice](https://www.staticapps.org/articles/defining-static-web-apps/)

[React JS](https://reactjs.org/)
