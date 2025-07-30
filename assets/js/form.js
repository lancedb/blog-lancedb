document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const formSubmit = document.querySelector(".js-form-submit");
    if (!formSubmit) return;
    const submitName = document.querySelector(".js-submit-name");

    formSubmit.addEventListener("click", (event) => {
      event.preventDefault();
      const form = document.querySelector(".form form");
      const submitButton = form.querySelector("input[type='submit']");
      const formData = new FormData(form);
      
      const firstName = formData.get("firstname")?.trim() || "";
      const lastName = formData.get("lastname")?.trim() || "";
      submitName.textContent = [firstName, lastName].filter(Boolean).join(" ");

      submitButton.click();
    });
  })();
});
