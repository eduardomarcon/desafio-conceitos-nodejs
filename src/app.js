const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();
app.use(express.json());
app.use(cors());

function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "invalid repository id" });
  }
  return next();
}

app.use("/repositories/:id", validateRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (indexRepository < 0) {
    return response.status(400).json({ error: "repository not found" });
  }
  const { title, url, techs } = request.body;
  const repository = { id, title, url, techs };
  const oldRepository = repositories[indexRepository];
  const mewRepository = { ...oldRepository, ...repository };
  repositories[indexRepository] = mewRepository;
  return response.json(mewRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (indexRepository < 0) {
    return response.status(400).json({ error: "repository not found" });
  }
  repositories.splice(indexRepository, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (indexRepository < 0) {
    return response.status(400).json({ error: "repository not found" });
  }
  const oldRepository = repositories[indexRepository];
  let { likes } = oldRepository;
  const newRepository = { ...oldRepository, likes: ++likes };
  repositories[indexRepository] = newRepository;
  return response.json(newRepository);
});

module.exports = app;
