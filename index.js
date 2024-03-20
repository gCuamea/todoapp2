const express = require("express");
const nlp = require("compromise");

const app = express();
const server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening to requests on port " + process.env.PORT);
});

app.use(express.json());

const appStorage = {};

// Archivos estaticos
app.use(express.static("public"));

app.post("/login", (req, res) => {
  console.log("login");
  const { username, password } = req.body;
  const user = appStorage[username];
  // User found
  if (user && user.password === password) {
    return res
      .status(200)
      .send({
        message: "Se ingreso correctamente",
        user: { user: username, ...user },
      });
  }

  return res.status(400).send({
    message: "Este usuario no existe o la contraseña es incorrecta",
  });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // User already exists
  const user = appStorage[username];
  if (user) {
    return res.status(400).send({ message: "Este usuario ya existe" });
  }

  // New user
  appStorage[username] = {
    password,
    todos: [],
  };
  return res.status(200).send({
    message: "Usuario creado con exito!",
    user: { user: username, ...appStorage[username] },
  });
});

app.post("/addtodo", (req, res) => {
  const { que, cuando, donde, username } = req.body;
  appStorage[username].todos.push({ que, cuando, donde, finished: false });

  return res
    .status(200)
    .send({ message: "Añadido con exito", user: { user: username, ...appStorage[username] } });
});

app.delete("/deletetodo", (req, res) => {
  console.log("deletetodo");
  // add note to db

  return res;
});

app.patch("/finishnote", (req, res) => {
  console.log("finishnote");
  // add note to db

  return res;
});