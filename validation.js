// If invalid, we put a red message INSIDE the textbox (per assignment).
function markInvalid(input, msg) {
  input.dataset.invalidMsg = msg;
  input.classList.add("invalid-input");
  input.style.color = "red";

  // Only overwrite value with message if it's empty or already an error message
  if (input.value.trim() === "" || input.value === input.dataset.invalidMsg) {
    // For password fields, switch to text so message can be seen
    if (input.type === "password") input.type = "text";
    input.value = msg;
  }
}

function clearInvalid(input) {
  // If the textbox is currently showing an error message, clear it
  if (input.dataset.invalidMsg && input.value === input.dataset.invalidMsg) {
    input.value = "";
  }

  input.classList.remove("invalid-input");
  input.style.color = "";
  
  // Switch password fields back to password type
  if (input.id === "password" || input.id === "confirmPassword") {
    input.type = "password";
  }
}

function handleFocus(input) {
  // On click/focus, clear the error message so user can type
  if (input.dataset.invalidMsg && input.value === input.dataset.invalidMsg) {
    input.value = "";
  }

  // If it was a password field and got flipped to text, flip back
  if (input.id === "password" || input.id === "confirmPassword") {
    input.type = "password";
  }
}

function isValidEmail(email) {
  // Simple email pattern: something@something.something
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

function validateField(input) {
  const id = input.id;
  const value = input.value.trim();

  // If user entered something real (not the error message), reset styling
  if (input.dataset.invalidMsg && value !== input.dataset.invalidMsg) {
    clearInvalid(input);
  }

  // Required checks
  if (value === "" || value === input.dataset.invalidMsg) {
    markInvalid(input, "Field is required");
    return false;
  }

  // Email format
  if (id === "email") {
    if (!isValidEmail(value)) {
      markInvalid(input, "Enter valid email (joe@test.com)");
      return false;
    }
  }

  // Password match check (do it when either password field loses focus)
  if (id === "password" || id === "confirmPassword") {
    const pw = document.getElementById("password");
    const cpw = document.getElementById("confirmPassword");

    const pwVal = pw.value.trim();
    const cpwVal = cpw.value.trim();

    // If either is still blank, don't force mismatch yet (required covers it)
    if (
      pwVal !== "" && cpwVal !== "" &&
      pwVal !== pw.dataset.invalidMsg &&
      cpwVal !== cpw.dataset.invalidMsg
    ) {
      if (pwVal !== cpwVal) {
        markInvalid(cpw, "Passwords must match");
        return false;
      } else {
        clearInvalid(pw);
        clearInvalid(cpw);
        return true;
      }
    }
  }

  // If passed, ensure normal look
  clearInvalid(input);
  return true;
}

function validateForm() {
  const fields = ["username", "email", "password", "confirmPassword"];
  let ok = true;

  for (const id of fields) {
    const input = document.getElementById(id);
    const valid = validateField(input);
    if (!valid) ok = false;
  }

  // Final password match enforcement
  const pw = document.getElementById("password");
  const cpw = document.getElementById("confirmPassword");

  const pwVal = pw.value.trim();
  const cpwVal = cpw.value.trim();

  if (
    ok &&
    pwVal !== "" &&
    cpwVal !== "" &&
    pwVal !== pw.dataset.invalidMsg &&
    cpwVal !== cpw.dataset.invalidMsg &&
    pwVal !== cpwVal
  ) {
    markInvalid(cpw, "Passwords must match");
    ok = false;
  }

  return ok; // returning false blocks submit
}
