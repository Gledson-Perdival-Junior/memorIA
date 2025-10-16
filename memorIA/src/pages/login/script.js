document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const registerBtn = document.getElementById("registrar");
  const loginBtn = document.getElementById("login");
  const trilho = document.getElementById("trilho");
  const body = document.querySelector("body");

  trilho?.addEventListener("click", () => {
    trilho.classList.toggle("dark");
    body.classList.toggle("dark");
  });

  registerBtn?.addEventListener("click", () =>
    container.classList.add("active")
  );
  loginBtn?.addEventListener("click", () =>
    container.classList.remove("active")
  );

  const entrarForm = document.getElementById("entrarForm");
  entrarForm?.addEventListener("submit", entrar);

async function entrar(event) {
  event.preventDefault();
  const nome = document.getElementById("nomeUsuario").value.trim();
  const senha = document.getElementById("senhaUsuario").value.trim();

  if (!nome || !email || !senha) {
    mostrarToast("Ainda em desenvolvimento", "erro");
    return;
  }

}

function mostrarToast(mensagem, tipo) {
  Toastify({
    text: mensagem,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor:
      tipo === "sucesso"
        ? "linear-gradient(200deg, #0b152c, #092050)"
        : "linear-gradient(200deg, #500000, #a00000)",
  }).showToast();
}
})