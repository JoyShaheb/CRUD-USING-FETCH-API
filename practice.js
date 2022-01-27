let getBTN = document.getElementById("get-btn");
let output = document.getElementById("output");
let emailInput = document.getElementById("emailInput");
let fnInput = document.getElementById("fnInput");
let lnInput = document.getElementById("lnInput");
let create = document.getElementById("create");
let msg = document.getElementById("msg");
let form = document.getElementById("form");
let editForm = document.getElementById("editForm");
let edit = document.getElementById("edit");

let editFnInput = document.getElementById("edit-fnInput");
let editLnInput = document.getElementById("edit-lnInput");

let base = "https://dummyapi.io/data/v1/";
let credentials = "61f1819dce21730d986277da";

/**
 * ! Accept and store Data here
 */

let data = {};

let acceptData = () => {
  data["email"] = emailInput.value;
  data["firstName"] = fnInput.value;
  data["lastName"] = lnInput.value;
};

/**
 * ! Form Validation part here
 */

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidate();
});

let formValidate = () => {
  if (emailInput.value === "" || fnInput.value === "" || lnInput.value === "") {
    msg.innerHTML = "Text cannot be blank";
  } else {
    msg.innerHTML = "";
    acceptData();
    console.log(data);
    postRequest();
    create.setAttribute("data-bs-dismiss", "modal");
    create.click();
    (() => {
      create.setAttribute("data-bs-dismiss", "");
    })();
  }
};

/**
 * ! Header part here
 */

let a = new Headers();
a.append("app-id", credentials);
a.append("Content-Type", "application/json");

/**
 * ! request Template part here
 */

let requestTemplate = (x, y, z) => {
  return new Request(`${base}${x}`, {
    method: y,
    headers: a,
    body: JSON.stringify(z),
    redirect: "follow", // optional part
  });
};

/**
 * ! GET REQUEST
 **/

getBTN.addEventListener("click", async () => {
  let x = await fetch(requestTemplate("user?created=1", "GET")).then((res) =>
    res.json()
  );
  console.log(x.data);

  output.innerHTML = x.data
    .map(
      (xx, yy) => `
    <div id=${xx.id}>
      <h3>Post ${yy}</h3>
      <p>id: ${xx.id}</p>
      <span class="fw-bold">firstName :</span>
      <span>${xx.firstName}</span>
      <br />
      <span class="fw-bold">LastName :</span>
      <span> ${xx.lastName}</span>
      <button onClick="deletePost(this)" class="btn btn-danger">DELETE</button>
      <button onClick="editPost(this)" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editForm">EDIT</button>
  </div>
  `
    )
    .join("");
});

/**
 * ! DELETE REQUEST
 **/

let deletePost = async (click) => {
  let x = await fetch(
    requestTemplate(`user/${click.parentElement.id}`, "DELETE")
  ).then((res) => res.json());
  console.log(x);
  getBTN.click();
};

/**
 * ! POST REQUEST
 **/

let postRequest = async () => {
  let x = await fetch(requestTemplate(`user/create`, "POST", data)).then(
    (res) => res.json()
  );
  console.log(x);
  getBTN.click();
};

/**
 * ! PUT REQUEST
 **/

let selectedID;

let editPost = (click) => {
  console.log(click.parentElement.id);
  selectedID = click.parentElement.id;
  editFnInput.value = click.parentElement.children[3].innerHTML;
  editLnInput.value = click.parentElement.children[5].innerHTML;
};

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

edit.addEventListener("click", async () => {
  let edittedData = {
    firstName: editFnInput.value,
    lastName: editLnInput.value,
  };
  let x = await fetch(
    requestTemplate(`user/${selectedID}`, "PUT", edittedData)
  ).then((res) => res.json());
  console.log(x);
  getBTN.click();
});
