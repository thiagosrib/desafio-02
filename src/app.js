const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjetcId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' })
  }

  return next();
}

app.use('/repositories/:id', validateProjetcId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title) {
    response.status(400).json({ error: 'Invalid title' })
  }

  if (!url || !url.includes('github.com')) {
    response.status(400).json({ error: 'Invalid url' })
  }

  if (!techs || !Array.isArray(techs)) {
    response.status(400).json({ error: 'Invalid techs' })
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(respository => respository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const respository = { ...repositories[repositoryIndex], title, url, techs };

  repositories[repositoryIndex] = respository;

  return response.json(respository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const respositoryIndex = repositories.findIndex(respository => respository.id === id);

  if (respositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(respositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(respository => respository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const respository = { ...repositories[repositoryIndex], likes: repositories[repositoryIndex].likes + 1 };

  repositories[repositoryIndex] = respository;

  return response.json(respository);}
);

module.exports = app;
