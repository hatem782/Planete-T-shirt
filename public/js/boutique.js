$(document).on("click", ".bouttonDetailBoutique", function (e) {
  $(".boutiqueDetail").show();
  $(".boutique").hide();
});
$(document).on("click", ".retourBoutique", function (e) {
  $(".boutique").show();
  $(".boutiqueDetail").hide();
});
