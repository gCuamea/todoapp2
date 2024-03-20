// QUERY DOM
const password = document.getElementById("password");
const username = document.getElementById("username");
const contenedor = document.getElementById("contenedor");
const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");
const nlp = window.nlp;
let user = {};

const renderAllTodos = () => {
  const { todos } = user;
  const rootContainer = document.createElement("div");
  rootContainer.id = "todocontainer";

  contenedor.querySelector("#todocontainer")?.remove();

  todos.forEach((todo) => {
    const todoContainer = document.createElement("div");
    const queContainer = document.createElement("div");
    const cuandoContainer = document.createElement("div");
    const dondeContainer = document.createElement("div");

    todoContainer.classList.add("todocontainer");

    queContainer.innerText = todo.que;
    cuandoContainer.innerText = todo.cuando;
    dondeContainer.innerText = todo.donde;

    todoContainer.appendChild(queContainer);
    todoContainer.appendChild(cuandoContainer);
    todoContainer.appendChild(dondeContainer);

    rootContainer.appendChild(todoContainer);
  });

  contenedor.appendChild(rootContainer);
};

const renderAfterLogin = () => {
  const tableHeader = document.createElement("div");
  tableHeader.innerHTML =
    "<h3>Qué</h3><h3>Cuándo</h3><h3>Dónde</h3";
    // "<div>Que</div><div>Cuando</div><div>Donde</div><div>Terminado?</div><div>Borrar</div>";
  tableHeader.className = "todocontainer";

  const addTodoBtn = document.createElement("button");
  addTodoBtn.innerText = "Crear nuevo ToDo";
  addTodoBtn.onclick = async () => {
    let queInput;
    let cuandoInput;
    let dondeInput;

    const results = await Swal.fire({
      title: "Login Form",
      html: `
              <input type="text" id="queInput" class="swal2-input" placeholder="Qué">
              <input type="text" id="cuandoInput" class="swal2-input" placeholder="Cuándo">
              <input type="text" id="dondeInput" class="swal2-input" placeholder="Dónde">
            `,
      confirmButtonText: "Sign in",
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup();
        queInput = popup.querySelector("#queInput");
        cuandoInput = popup.querySelector("#cuandoInput");
        dondeInput = popup.querySelector("#dondeInput");
      },
      preConfirm: () => {
        const que = queInput.value;
        const cuando = cuandoInput.value;
        const donde = dondeInput.value;
        if (!que || !cuando || !donde) {
          Swal.showValidationMessage(`Por favor llena todos los campos.`);
        }
        return { que, cuando, donde };
      },
    });

    const { que, cuando, donde } = results.value;

    const resp = await fetch("/addtodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
      },
      body: JSON.stringify({
        que,
        cuando,
        donde,
        username: user.user,
      }),
    });

    const parsedResp = await resp.json();
    user = parsedResp.user;
    renderAllTodos();
  };

  // AI
  const addTodoBtnAi = document.createElement("button");
  addTodoBtnAi.innerText = "Crear nuevo ToDo (AI) (Ingles)";
  addTodoBtnAi.onclick = async () => {
    const resultsAi = await Swal.fire({
      title: "Nuevo Todo (AI)",
      html: `   <h3>Describe tu todo con qué, cuándo y dónde.</h3>
                <span>Ejemplo: Find Nemo in New York on March 1st</span>
                <input type="text" id="queInput" class="swal2-input" placeholder="Descripcion.">
              `,
      confirmButtonText: "Crear con inteligencia artificial.",
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup();
        queInputAi = popup.querySelector("#queInput");
      },
      preConfirm: () => {
        const queAi = queInput.value;

        if (!queAi) {
          Swal.showValidationMessage(`Por favor llena todos los campos.`);
        }
        return { queAi };
      },
    });

    const { queAi } = resultsAi.value;

    const doc = nlp(queAi);
    const eventName = `${doc.verbs().text()} ${doc.match('#Noun').text()}`;
    const eventDate = doc.match("#Date").text();
    const eventTime = doc.match("#Time").text();
    const eventDateTime = [eventDate, eventTime].filter(Boolean).join(', ')
    const eventPlace = await doc.places().text(); // Get the first detected place

    // let queInput;
    // let cuandoInput;
    // let dondeInput;

    const results = await Swal.fire({
      title: "Nuevo Todo",
      html: `
              <input type="text" id="queInput" class="swal2-input" placeholder="Qué" value="${eventName}">
              <input type="text" id="cuandoInput" class="swal2-input" placeholder="Cuándo" value="${eventDateTime}">
              <input type="text" id="dondeInput" class="swal2-input" placeholder="Dónde" value="${eventPlace}">
            `,
      confirmButtonText: "Crear Todo",
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup();
        queInput = popup.querySelector("#queInput");
        cuandoInput = popup.querySelector("#cuandoInput");
        dondeInput = popup.querySelector("#dondeInput");
      },
      preConfirm: () => {
        const que = queInput.value;
        const cuando = cuandoInput.value;
        const donde = dondeInput.value;
        if (!que || !cuando || !donde) {
          Swal.showValidationMessage(`Por favor llena todos los campos.`);
        }
        return { que, cuando, donde };
      },
    });

    const { que, cuando, donde } = results.value;

    const resp = await fetch("/addtodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
      },
      body: JSON.stringify({
        que,
        cuando,
        donde,
        username: user.user,
      }),
    });

    const parsedResp = await resp.json();
    user = parsedResp.user;
    renderAllTodos();
  };

  contenedor.innerHTML = "";
  contenedor.appendChild(addTodoBtn);
  contenedor.appendChild(addTodoBtnAi);
  contenedor.appendChild(tableHeader);
  renderAllTodos();
};

// LOGIN
loginBtn?.addEventListener("click", async () => {
  const resp = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify JSON content type
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });
  const parsedResp = await resp.json();

  if (resp.status === 200) {
    await Swal.fire({
      title: "Login exitoso!",
      text: parsedResp.message,
      icon: "success",
      confirmButtonText: "Ok",
    });

    console.log("logininfo", parsedResp.user);
    user = parsedResp.user;
    renderAfterLogin();
  }

  if (resp.status === 400) {
    await Swal.fire({
      title: "Error!",
      text: parsedResp.message,
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
});

// REGISTRO
registerBtn?.addEventListener("click", async () => {
  const resp = await fetch("/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });

  const parsedResp = await resp.json();

  if (resp.status === 200) {
    await Swal.fire({
      title: "Registro exitoso!",
      text: parsedResp.message,
      icon: "success",
      confirmButtonText: "Ok",
    });

    console.log("registerinfo", parsedResp.user);
    user = parsedResp.user;
    renderAfterLogin();
  }

  if (resp.status === 400) {
    await Swal.fire({
      title: "Error!",
      text: parsedResp.message,
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
});
