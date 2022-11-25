const supertest = require("supertest");
const app = require("../index");
const request = supertest(app);

let image =
  "https://www.customink.com/assets/site_content/pages/home/three_box_element/oct/5-51569308477076023bdd68a652fa7b774e4e3b9257addbcdd0dab8f805d39345.jpg";
let desc =
  "Add more color to the cooler months with bright custom short sleeve t-shirts for every group and occasion.";

describe("Articles", () => {
  let ArticleId = "";

  it("should be able to add new article", async () => {
    const response = await request.post("/article/add").send({
      libelle: "Short Sleeve 109",
      image: image,
      description: desc,
      price: "12",
    });
    expect(response.status).toBe(200);
    expect(response?.body.Success).toBe(true);
    expect(response?.body.Message).toEqual("aricle a été ajouté");
  });

  it("it must return 400 because we are adding an existing article", async () => {
    const response = await request.post("/article/add").send({
      libelle: "Short Sleeve 109",
      image: image,
      description: desc,
      price: "12",
    });
    expect(response.status).toBe(400);
    expect(response?.body.Success).toBe(false);
    expect(response?.body.Message).toEqual("produit deja exist");
  });

  it("should be able to get all articles", async () => {
    const response = await request.get("/article/getall");
    let articleLength = response.body.data.articles.length;
    ArticleId = response.body.data.articles[articleLength - 1]._id;
    expect(response.status).toBe(200);
    expect(response?.body.Success).toBe(true);
    expect(response?.body.Message).toEqual("tous articles");
    expect(articleLength).toBeGreaterThan(0);
  });

  it("should be able to update the last article", async () => {
    const response = await request.put(`/article/update/${ArticleId}`).send({
      libelle: "Short Sleeve 109",
      image: image,
      description: desc,
      price: "30",
    });
    expect(response.status).toBe(200);
    expect(response?.body.Success).toBe(true);
    expect(response?.body.Message).toEqual("aricle a été modifié");
    expect(response.body.updated.price).toEqual(30);
  });

  it("should be able to update the last article", async () => {
    const response = await request.delete(`/article/remove/${ArticleId}`);
    expect(response.status).toBe(200);
    expect(response?.body.Message).toEqual("Article a été supprimé");
  });
});
