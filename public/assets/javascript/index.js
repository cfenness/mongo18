$(document).ready(function() {
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  initPage();

  function initPage() {
    articleContainer.empty();
    $.get("/api/headlines?saved=false").then(function(data) {
      if (data && data.length) {
        renderArticles(data);
      }
      else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    var articlePanels = [];
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {

    var panel = $(
      [
        "<div class='col-sm-3' style='border-style: solid; padding-top: 5px; padding-right: 5px; height: 185px;'",
        "<div class='card' style='width: 18rem;'>",
        "<div class='card-body'>",
        "<h5 class='card-title' style='text-align: center; font-family: 'Chicle', cursive;'>",
        article.headline,
        "</h5>",
        "<p class='card-text' style='font-family: 'Chicle', cursive;'>",
        article.summary,
        "</p>",
        "<a class='article-link btn btn-primary' target='_blank' style='position: absolute; bottom: 2px;' href='" + article.url + "'>Read Me!</a>",
        "</div>",
        "</div>",
        "</div>"
      ].join("")
    );

    panel.data("_id", article._id);
    return panel;
  }

  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh No Articles Saved.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {

    var articleToSave = $(this)
      .parents(".panel")
      .data();
    articleToSave.saved = true;
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      if (data.saved) {
        initPage();
      }
    });
  }

  function handleArticleScrape() {
    $.get("/api/fetch").then(function(data) {
      initPage();
      bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
    });
  }
});
