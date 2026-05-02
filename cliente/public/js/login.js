import { showMessage } from "./global.js";

const loginBtn = document.getElementById("login-btn");
const loginInput = document.querySelectorAll(".login-input");

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginInput.value = "";
    showMessage("El panel se encuentra en mantenimento...", "error");
})