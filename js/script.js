/* global $ */

// variabile di appoggio sul quale andrò a salvare la chiamata ajax pe recuperare l'array di oggetti del 'Genere'
let tempGenre;

// variabile di appoggio sul quale andrò a salvare la chiamata ajax pe recuperare l'array di oggetti dei film tramite query
let tempObj;


// funzione che andarà a clonare n volte il template film-template
const render = (arrObj, generObj, sortingKey = "popularity") => {
    //reset del contenuto html
    $(".film-container > ul").html("");

    if (arrObj.results.length == 0) {
        return alert("Nessun risultato trovato");
    }

    $("#sort-genre").html("");
    $("#sort-genre").append(`<option value="all">All</option>`);

    var source = document.getElementById("film-template").innerHTML;
    var template = Handlebars.compile(source);

    //ciclo ogni oggetto in arrObj e in base all'argomento "sortingKey" cambio il sorting 
    arrObj.results.sort((a, b) => sortingKey == "vote_average" ? b[sortingKey] - a[sortingKey] : parseInt(b[sortingKey], 10) - parseInt(a[sortingKey], 10)).forEach(el => {

        // variabile di appoggio per salvare e poi stampare i generi
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
        // console.log(countStars);
        let tempStarArr = [];
        for (let i = 0; i < countStars; i++) {
            console.log(i);
            tempStarArr.push(`<li><i class="fas fa-star"></i></li>`);
        }
        for (let i = 0; i < 5 - countStars; i++) {
            tempStarArr.push(`<li><i class="far fa-star"></i></li>`);
        }
        console.log(tempStarArr);

        //creo l'oggetto che servirà per compilare in automatico con handlebars
        const context = {

            "poster_path": el.poster_path,
            "title": el.title,
            "original_title": el.original_title,
            "original_language": el.original_language,
            "release_date": el.release_date,
            "overview": el.overview.split(" ").slice(0, 30).join(" ") + "...",
            "genre": genreArr.join(", "),
            "popularity": el.popularity,
            "vote_average": el.vote_average,
            "vote-star": tempStarArr.join(" "),
        }

        // compilo il template e lo aggiungo all'html
        var html = template(context);
        $(".film-container > ul").append(html);

        // $(".film-sheet.active").find(".vote-star ul").append(tempStarArr.join(" "));
        // $(".film-sheet.active").removeClass("active");

    });
}



const ajaxCallMovie = (string, generObj) => {

    $.ajax(
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
                console.log(data);
                tempObj = data;
                render(data, generObj);
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

    ajaxCallGenre();

    $("#search-film").keyup(function () {
        const searchInput = $("#search-film").val();

        if (event.which == 13 && searchInput != "") {
            ajaxCallMovie(searchInput, tempGenre);
        }
    });


    $("#sort-result").change(function () {

        const value = $(this).val();
        console.log(value);
        render(tempObj, tempGenre, value);
    })


    $("#sort-genre").change(function () {

        const value = $(this).val();

        $(".film-container .film-sheet").filter(function () {

            if (value == "all") {
                $(this).show();
            } else {
                $(this).toggle($(this).children(".genre").text().toLowerCase().includes(value));
            }
        });


    })









});