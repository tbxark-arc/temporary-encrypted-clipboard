const actionBtn = document.getElementById("action-btn");
const inputControl = document.getElementById("input");
const inputField = document.getElementById("input-field");
const textareaControl = document.getElementById("textarea");
const textareaField = document.getElementById("textarea-field");
const labelField = document.getElementById("label");
const linkField = document.getElementById("link-field");

const url = new URL(document.location.href);
const cmp = url.pathname.split("/");

switch (cmp.length > 1 && cmp[1] == "d" ? "decrypt" : "encrypt") {
  case "encrypt":
    inputField.style.display = "block";
    actionBtn.onclick = () => {
      const password = inputControl.value;
      const content = textareaControl.value;
      fetch("/api/encrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, content }),
      })
        .then((res) => res.json())
        .catch((err) => {
          error: err.message;
        })
        .then((data) => {
          if (data.url) {
            labelField.innerHTML = `<a href="${data.url}">${data.url}</a>`;
          } else if (data.error) {
            labelField.innerHTML = data.error;
            labelField.style.color = "red";
          }
          linkField.style.display = "block";
          textareaField.style.display = "none";
          inputControl.style.display = "none";
          actionBtn.innerHTML = "Copy";
          actionBtn.onclick = () => {
            navigator.clipboard.writeText(data.url);
          };
        });
    };
    break;
  case "decrypt":
    document.getElementById("textarea-title").innerHTML = "Decrypted Content:";
    const key = cmp[2];
    const password = url.searchParams.get("pwd");
    fetch("/api/decrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, password }),
    })
      .then((res) => res.json())
      .catch((err) => {
        error: err.message;
      })
      .then((data) => {
        if (data.content) {
          textareaControl.innerHTML = data.content;
        } else if (data.error) {
          textareaControl.innerHTML = data.error;
          textareaControl.style.color = "red";
        }
        textareaControl.style.display = "block";
        inputControl.style.display = "none";
        linkField.style.display = "none";
        actionBtn.innerHTML = "Copy";
        actionBtn.onclick = () => {
          navigator.clipboard.writeText(data.content);
        };
      });
    break;
}
