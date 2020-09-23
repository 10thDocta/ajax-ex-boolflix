/* global $ */

// variabile di appoggio sul quale andrò a salvare la chiamata ajax pe recuperare l'array di oggetti del 'Genere'
let tempGenre;

// variabile di appoggio sul quale andrò a salvare la chiamata ajax pe recuperare l'array di oggetti dei film tramite query
let tempMovie;
let tempTv;

let tempTest = [];



//funzione di reset
const reset = () => {
    $(".film-container > ul").html("");
}


// funzione che andarà a clonare n volte il template film-template
const render = (arrObj, generObj, type = "", sortingKey = "popularity") => {

    //reset del contenuto html
    // reset();

    $("#sort-genre").html("");
    $("#sort-genre").append(`<option value="all">All</option>`);

    var source = document.getElementById("film-template").innerHTML;
    // eslint-disable-next-line no-undef
    var template = Handlebars.compile(source);

    //ciclo ogni oggetto in arrObj e in base all'argomento "sortingKey" cambio il sorting 
    arrObj.results.sort((a, b) => sortingKey == "vote_average" ? b[sortingKey] - a[sortingKey] : parseInt(b[sortingKey], 10) - parseInt(a[sortingKey], 10)).forEach(el => {

        // variabile di appoggio per salvare e poi stampare i generi per il campo filtra (#sort-genre)
        let genreArr = [];

        // ciclo ogni elemento dell'arrey generObj (generi) confrontandolo con ogni elemento dell'arrey genre_ids dentro a arrObj(film)
        generObj.genres.forEach(gen => {
            el.genre_ids.forEach(elGen => {
                if (elGen == gen.id) {

                    genreArr.push(gen.name);

                    if (!$("#sort-genre option").text().includes(gen.name)) {
                        $("#sort-genre").append(`<option value="${gen.name.toLowerCase()}">${gen.name}</option>`);
                    }
                }
            })
        })


        //creo n stelline in base alla valutazione media (el.vote_average)
        const countStars = Math.ceil(el.vote_average / 2);

        let tempStarArr = [];
        for (let i = 0; i < countStars; i++) {
            tempStarArr.push(`<li><i class="fas fa-star"></i></li>`);
        }
        for (let i = 0; i < 5 - countStars; i++) {
            tempStarArr.push(`<li><i class="far fa-star"></i></li>`);
        }

        //creo l'oggetto che servirà per compilare in automatico con handlebars
        const context = {
            "poster_path": el.poster_path != null ? "https://image.tmdb.org/t/p/w300/" + el.poster_path : "img/NoImage.png",
            "title": "",
            "original_title": "",
            "original_language": `img/flags/${el.original_language.slice(0, 2)}.svg `,
            "release_date": "",
            "overview": el.overview.split(" ").slice(0, 30).join(" ") + "...",
            "genre": genreArr.join(", "),
            "popularity": el.popularity,
            "vote_average": el.vote_average,
            "vote-star": tempStarArr.join(" "),
        }

        switch (type) {
            case "movie":
                context.title = el.title;
                context.original_title = el.original_title;
                context.release_date = el.release_date;
                break;

            case "tv":
                context.title = el.name;
                context.orginal_title = el.original_name;
                context.release_date = el.first_air_date;
                break;

            default:
                console.log("errore nell'argomento 'type'");
                break;
        }


        // compilo il template e lo aggiungo all'html
        var html = template(context);
        $(`.film-container > ul.${type}`).append(html);
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
                tempTest.push(data);
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
                tempTest.push(data);
                tempTv = data;
            },
            error: function (richiesta, stato, errori) {
                alert("E' avvenuto un errore.", errori);
            }
        }
    );
};


const ajaxCallGenre = () => {

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
                tempGenre = data;
            },
            error: function (richiesta, stato, errori) {
                alert("E' avvenuto un errore.", errori);
            }
        }
    );
};








// document ready
$(function () {

    // con questa chiamata richiamo e salvo l'array di oggetti del Genere
    ajaxCallGenre();

    // ricerca. Chiamata ajax solo alla pressione di invio (event.which == 13) e se il campo non è vuoto
    $("#search-film").keyup(function () {
        const searchInput = $("#search-film").val();

        if (event.which == 13 && searchInput != "") {

            $.when(ajaxCallMovie(searchInput), ajaxCallTv(searchInput)).done(function (movie, tv) {

                if (movie[0].results.length == 0 && tv[0].results.length == 0) {
                    return alert("Nessun risultato trovato");
                }

                reset();
                render(movie[0], tempGenre, "movie");
                render(tv[0], tempGenre, "tv");
            });
        }
    });

    // ordino in base alle opzioni del campo "ordina", richiamando la funzione render
    $("#sort-result").change(function () {

        let value = $(this).val();
        console.log(tempTest);
        // tempTest.forEach()
        reset();
        render(tempMovie, tempGenre, "movie", value);

        if (value == "release_date") {
            value = "first_air_date";
        }
        render(tempTv, tempGenre, "tv", value);

        console.log(tempMovie);
        console.log(tempTv);
    })

    // // filtro i risultati
    // $("#sort-genre").change(function () {

    //     const value = $(this).val();

    //     $(".film-container .film-sheet").filter(function () {

    //         if (value == "all") {
    //             $(this).show();
    //         } else {
    //             $(this).toggle($(this).children(".genre").text().toLowerCase().includes(value));
    //         }
    //     });


    // })









});