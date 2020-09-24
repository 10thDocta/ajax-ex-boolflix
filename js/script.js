/* global $ */

// variabile di appoggio sul quale andrò a salvare la chiamata ajax pe recuperare l'array di oggetti del 'Genere'
let tempGenreMovie;
let tempGenreTv;


// variabile di appoggio sul quale andrò a salvare la chiamata ajax pe recuperare l'array di oggetti dei film tramite query
let tempMovie;
let tempTv;

// let tempTest = [];

// variabile di appoggio per la lista dei generi per generare la select dei generi
let tempFilterGenre = [];


/* -------------------------- FUNZIONI --------------------------- */
// funzione di reset
const reset = () => {
    // cancello il contenuto di tutte le ul, per svuotare la pagina priam del nuovo popolamento
    $(".film-container ul").html("");
    //resetto la variabile tempFilterGenre
    tempFilterGenre = [];
    //riporto la selezione della select #sort-genre sul valore iniziale "all"
    $("#sort-genre").prop('selectedIndex', 0);
}


// funzione che andarà a clonare n volte il template film-template
const render = (arrObj, type = "", sortingKey = "popularity") => {

    var source = document.getElementById("film-template").innerHTML;
    // eslint-disable-next-line no-undef
    var template = Handlebars.compile(source);

    //ciclo ogni oggetto in arrObj e in base all'argomento "sortingKey" cambio il sorting
    //se la sortingKey è uguale a "vote_average" (che è un numero decimale) non uso parseInt altrimenti diventa intero 
    arrObj.results.sort((a, b) => sortingKey == "vote_average" ? b[sortingKey] - a[sortingKey] : parseInt(b[sortingKey], 10) - parseInt(a[sortingKey], 10)).forEach(el => {

        // variabile di appoggio per salvare e poi stampare i generi nel html
        let genreArr = [];
        let generObj;

        if (type == "movie") {
            generObj = tempGenreMovie;
        } else {
            generObj = tempGenreTv;
        }

        // ciclo ogni elemento dell'arrey generObj(generi) confrontandolo con ogni elemento dell'array genre_ids dentro a arrObj(film)
        generObj.genres.forEach(gen => {
            el.genre_ids.forEach(elGen => {
                if (elGen == gen.id) {

                    genreArr.push(gen.name);

                    if (!(tempFilterGenre.includes(gen.name))) {
                        tempFilterGenre.push(gen.name);
                    }
                }
            })
        })

        //creo n stelline in base alla valutazione media (el.vote_average)
        const countStars = Math.ceil(el.vote_average / 2);

        let tempStarArr = "";
        for (let i = 0; i < countStars; i++) {
            tempStarArr += `<li><i class="fas fa-star"></i></li>`;
        }
        for (let i = 0; i < 5 - countStars; i++) {
            tempStarArr += `<li><i class="far fa-star"></i></li>`;
        }

        //creo l'oggetto che servirà per compilare in automatico con handlebars
        const context = {
            "poster_path": el.poster_path != null ? "https://image.tmdb.org/t/p/w500" + el.poster_path : "https://image.tmdb.org/t/p/w300" + el.backdrop_path,
            "title": "",
            "original_title": "",
            "original_language": `img/flags/${el.original_language}.svg `,
            "release_date": "",
            "overview": el.overview.split(" ").slice(0, 30).join(" ") + "...",
            "genre": genreArr.length > 0 ? genreArr.join(", ") : "---",
            "popularity": el.popularity,
            "vote_average": el.vote_average,
            "vote-star": tempStarArr,
        }

        if (el.poster_path == null && el.backdrop_path == null) {
            context.poster_path = "#";
            context.hide = "hide";
            context.show = "show";
        }

        switch (type) {
            case "movie":
                context.title = el.title;
                context.original_title = el.original_title;
                context.release_date = el.release_date != "" ? el.release_date : "---";
                break;

            case "tv":
                context.title = el.name;
                context.original_title = el.original_name;
                context.release_date = el.first_air_date != "" ? el.first_air_date : "---";
                break;

            default:
                console.log("errore nell'argomento 'type'");
                break;
        }


        // compilo il template e lo aggiungo all'html
        var html = template(context);

        $(`.film-container ul.${type}`).append(html);
    });
}


/* --------------------- AJAX CALL ---------------------- */

const ajaxCallMovie = (string) => {

    return $.ajax(
        {
            url: "https://api.themoviedb.org/3/search/movie",
            data: {
                "api_key": "03169ac4448a78ca3285d0264770d6bc",
                "query": string,
                "adult": false,
                "language": "it-IT"
            },
            method: "GET",
            success: function (data) {
                // tempTest.push(data);
                tempMovie = data;
            },
            error: function (richiesta, stato, errori) {
                alert("E' avvenuto un errore.", errori);
            }
        }
    );
};

const ajaxCallTv = (string) => {

    return $.ajax(
        {
            url: "https://api.themoviedb.org/3/search/tv",
            data: {
                "api_key": "03169ac4448a78ca3285d0264770d6bc",
                "query": string,
                "adult": false,
                "language": "it-IT"
            },
            method: "GET",
            success: function (data) {
                // tempTest.push(data);
                tempTv = data;
            },
            error: function (richiesta, stato, errori) {
                alert("E' avvenuto un errore.", errori);
            }
        }
    );
};


const ajaxCallGenreMovie = () => {

    $.ajax(
        {
            url: "https://api.themoviedb.org/3/genre/movie/list",
            data: {
                "api_key": "03169ac4448a78ca3285d0264770d6bc",
                "language": "it-IT"
            },
            method: "GET",
            success: function (data) {
                //passo il risultato "data" della chiamata alla variabile "genre"
                tempGenreMovie = data;
            },
            error: function (richiesta, stato, errori) {
                alert("E' avvenuto un errore.", errori);
            }
        }
    );
};

const ajaxCallGenreTv = () => {

    $.ajax(
        {
            url: "https://api.themoviedb.org/3/genre/tv/list",
            data: {
                "api_key": "03169ac4448a78ca3285d0264770d6bc",
                "language": "it-IT"
            },
            method: "GET",
            success: function (data) {
                //passo il risultato "data" della chiamata alla variabile "genre"
                tempGenreTv = data;
            },
            error: function (richiesta, stato, errori) {
                alert("E' avvenuto un errore.", errori);
            }
        }
    );
};








/* ----------------------- DOCUMENT READY ------------------------ */
$(function () {

    // con questa chiamata richiamo e salvo l'array di oggetti del Genere
    ajaxCallGenreMovie();
    ajaxCallGenreTv();

    // ricerca. Chiamata ajax solo alla pressione di invio (event.which == 13) e se il campo non è vuoto
    $("#search-film").keyup(function () {
        const searchInput = $("#search-film").val();

        if (event.which == 13 && searchInput != "") {

            $.when(ajaxCallMovie(searchInput), ajaxCallTv(searchInput)).done(function (movie, tv) {

                if (movie[0].results.length == 0 && tv[0].results.length == 0) {
                    return alert("Nessun risultato trovato");
                }

                console.log(movie[0]);
                console.log(tv[0]);

                $(".movie-container").hide();
                $(".tv-container").hide();

                reset();
                if (movie[0].results.length != 0) {
                    render(movie[0], "movie");
                    $(".movie-container").show();
                }
                if (tv[0].results.length != 0) {
                    render(tv[0], "tv");
                    $(".tv-container").show();
                }

                $("#sort-genre").html("");
                $("#sort-genre").append(`<option value="all">All</option>`);
                $("#sort-result").prop('selectedIndex', 0);

                tempFilterGenre.sort().forEach(e => $("#sort-genre").append(`<option value="${e.toLowerCase()}">${e}</option>`))
            });
        }
    });

    // ordino in base alle opzioni del campo "ordina", richiamando la funzione render
    $("#sort-result").change(function () {

        let sortingKey = $(this).val();

        reset();
        if (tempMovie.results.length != 0) {
            render(tempMovie, "movie", sortingKey);

        }
        if (tempTv.results.length != 0) {
            if (sortingKey == "release_date") {
                sortingKey = "first_air_date";
            }
            render(tempTv, "tv", sortingKey);
        }

        console.log(tempMovie);
        console.log(tempTv);
    })

    // // filtro i risultati
    $("#sort-genre").change(function () {

        const value = $(this).val();

        $(".film-container .film-sheet").filter(function () {

            if (value == "all") {
                $(this).show();
            } else {
                $(this).toggle($(this).find(".genre").text().toLowerCase().includes(value));
            }
        });
    })









});