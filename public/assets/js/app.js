$("#scrape-btn").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).done(function(data) {
        $("#scrapeModal").modal();
    })
})
