$(".save-btn").on("click", function(){
	var articleId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/save/article/" + articleId
	}).done(function(){
		window.location.reload();
	})
});

$("#scrape-btn").on("click", function(){
	
	$.ajax({
		method: "GET",
		url: "/scrape" 
	}).done(function(){
		window.location.reload();
		$("#scrapeModal").modal();
	})
});

$(".unsave-btn").on("click", function(){
	var articleId = $(this).attr("data-id");
	$.ajax({
		method:"POST",
		url: "/unsave/article/" + articleId
	}).done(function(){
		window.location.reload();
	})
	})
});

$(document).on("click", ".newNote-btn" function(event){
	event.preventDefault();
	var articleId= $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/save/note/" + articleId
	}).done(
		window.location.reload();
	)
})