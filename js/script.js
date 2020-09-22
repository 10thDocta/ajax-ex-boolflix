/* global $ */

const render = arrObj => {

    console.log(arrObj);
    //reset del contenuto html
    $(".film-container").html("");

    if (arrObj.results.length == 0) {
        return alert("Nessun risultato trovato");
    }

    var source = document.getElementById("film-template").innerHTML;
    var template = Handlebars.compile(source);

    // // fatto un sort sulle date
    // arrObj.results.sort((a, b) => parseInt(a.release_date, 10) - parseInt(b.release_date, 10)).forEach(element => {
    //     var html = template(element);
    //     $(".film-container").append(html);
    // });

    // fatto un sort sulla popolarità
    arrObj.results.sort((a, b) => parseInt(b.popularity, 10) - parseInt(a.popularity, 10)).forEach(element => {
        var html = template(element);
        $(".film-container").append(html);
    });

    // arrObj.results.forEach(element => {
    //     var html = template(element);
    //     $(".film-container").append(html);
    // });
}



const ajaxCall = string => {
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
                render(data);
            },
            error: function (richiesta, stato, errori) {
                alert("E' avvenuto un errore.", errori);
            }
        }
    );
};






$(function () {


    $("#search-film").keyup(function () {

        const searchInput = $("#search-film").val()

        if (event.which == 13 && searchInput != "") {
            ajaxCall(searchInput);
        }

    });


});