// Grab the articles as a json

$(document).on("click", "#viewallarticles", function() {
    $("#articles").empty();
    $.getJSON("/articles", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        }
    });
});

$(document).on("click", "#viewsavedarticles", function() {
    $("#articles").empty();
    $.getJSON("/saved", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        }
    });
});
  
$(document).on("click", "#loadarticles", function() {
    $.ajax({
        method: "GET",
        url: "/scrape/"
    }).then(function() {
        setTimeout(function() {
            $("#articles").empty();
            $.getJSON("/articles", function(data) {
                // For each one
                for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
                }
            });
        }, 2000);
    })
});

$(document).on("click", "#cleararticles", function() {
    $.ajax({
        method: "GET",
        url: "/clear/"
    }).then(function() {
        $("#articles").empty();
        $.getJSON("/articles", function(data) {
            // For each one
            for (var i = 0; i < data.length; i++) {
              // Display the apropos information on the page
              $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
            }
        });
    })
});
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // A button to save and unsave articles (depending on whether it is saved)
        if (data.isSaved === false) {
            $("#notes").append("<button data-id='" + data._id + "' id='savearticle'>Save Article</button>");
        } else {
            $("#notes").append("<button data-id='" + data._id + "' id='unsavearticle'>Unsave Article</button>");
        }
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
          $("#notes").append("<button data-id='" + data._id + "' id='clearnote'>Clear Note</button>");
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

    // When you click the clearnote button
    $(document).on("click", "#clearnote", function() {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");
      
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
          method: "POST",
          url: "/articles/" + thisId,
          data: {
            // Empty value
            title: "",
            // Empty value
            body: ""
          }
        })
          // With that done
          .then(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
          });
      
        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
      });
  
  $(document).on("click", "#savearticle", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId + "/save",
    }).then(function(data) {
    console.log(data);
    }).then(function() {
        $("#notes").empty();
        $("#articles").empty();
        $.getJSON("/saved", function (data) {
            // For each one
            for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
            }
        });
    })
  })

$(document).on("click", "#unsavearticle", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId + "/save",
    }).then(function (data) {
        console.log(data);
    }).then(function () {
        $("#notes").empty();
        $("#articles").empty();
        $.getJSON("/articles", function (data) {
            // For each one
            for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
            }
        });
    });
});