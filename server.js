/********************************************************************************
*  WEB422 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Priyangan Chandrathayan Student ID: 159189224 Date: 16/05/2025
*
*  Published URL on Vercel:  https://web422-sites-api.vercel.app/
*
********************************************************************************/

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const SitesDB = require("./modules/sitesDB");
const db = new SitesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Listening", term: "Summer 2025", student: "Priyangan Chandrathayan" });
});

app.post("/api/sites", (req, res) => {
  db.addNewSite(req.body)
    .then((newSite) => res.status(201).json(newSite))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/api/sites", (req, res) => {
  const { page, perPage, name, region, provinceOrTerritoryName } = req.query;

  db.getAllSites(parseInt(page), parseInt(perPage), name, region, provinceOrTerritoryName)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/api/sites/:id", (req, res) => {
  db.getSiteById(req.params.id)
    .then((site) => {
      if (site) res.json(site);
      else res.status(404).json({ message: "Site not found" });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.put("/api/sites/:id", (req, res) => {
  db.updateSiteById(req.body, req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.delete("/api/sites/:id", (req, res) => {
  db.deleteSiteById(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json({ error: err.message }));
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});