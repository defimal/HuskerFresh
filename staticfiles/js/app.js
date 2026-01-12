document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector('[data-filter="search"]');
  const cards = document.querySelectorAll("[data-request-card]");

  const filterCards = () => {
    const query = (searchInput?.value || "").toLowerCase();
    cards.forEach((card) => {
      const text = card.dataset.searchBlob || "";
      const matchesQuery = text.includes(query);
      card.style.display = matchesQuery ? "" : "none";
    });
  };

  searchInput?.addEventListener("input", filterCards);

  // Micro animation on CTA buttons
  document.querySelectorAll(".hf-actions button:not(:disabled)").forEach((btn) => {
    btn.addEventListener("mouseover", () => btn.classList.add("wiggle"));
    btn.addEventListener("animationend", () => btn.classList.remove("wiggle"));
  });

  const donateModal = document.querySelector("[data-donate-modal]");
  if (donateModal) {
    const closeButtons = donateModal.querySelectorAll("[data-donate-close]");
    const closeModal = () => donateModal.setAttribute("hidden", "");
    closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    });

    document.querySelectorAll("[data-donate-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        const requester = form.dataset.requester || "this student";
        const messageEl = donateModal.querySelector("[data-donate-message]");
        if (messageEl) {
          messageEl.textContent = `Congrats! You donated to ${requester}.`;
        }
        donateModal.removeAttribute("hidden");
        setTimeout(() => form.submit(), 400);
        event.preventDefault();
      });
    });
  }

  const requestModal = document.querySelector("[data-request-modal]");
  if (requestModal) {
    const sourceEl = document.querySelector("[data-request-message-source]");
    const messageEl = requestModal.querySelector("[data-request-message]");
    if (sourceEl && messageEl) {
      messageEl.textContent = sourceEl.textContent.trim();
      requestModal.removeAttribute("hidden");
    }

    const closeButtons = requestModal.querySelectorAll("[data-request-close]");
    const closeModal = () => requestModal.setAttribute("hidden", "");
    closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    });
  }
});
