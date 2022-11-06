// $(document).on("click", ".bouttonDetailArticle", function (e) {
//   $("#articleMain").show();
//   $(".mainArticle").hide();
// });
// $(document).on("click", ".retourCatalogue", function (e) {
//   $(".mainArticle").show();
//   $("#articleMain").hide();
// });

const showDetaille = (idArticle = "") => {
  $(`#articleMain`).show();
  $(`.mainArticle`).hide();
};

const hideDetaille = (idArticle = "") => {
  $(`#articleMain`).hide();
  $(`.mainArticle}`).show();
};
