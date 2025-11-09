document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector('[data-filter="search"]');
  const statusSelect = document.querySelector('[data-filter="status"]');
  const cards = document.querySelectorAll("[data-request-card]");

  const filterCards = () => {
    const query = (searchInput?.value || "").toLowerCase();
    const status = statusSelect?.value || "all";

    cards.forEach((card) => {
      const text = card.dataset.searchBlob || "";
      const cardStatus = card.dataset.status || "open";
      const matchesQuery = text.includes(query);
      const matchesStatus = status === "all" || status === cardStatus;
      card.style.display = matchesQuery && matchesStatus ? "" : "none";
    });
  };

  searchInput?.addEventListener("input", filterCards);
  statusSelect?.addEventListener("change", filterCards);

  // Micro animation on CTA buttons
  document.querySelectorAll(".hf-actions button:not(:disabled)").forEach((btn) => {
    btn.addEventListener("mouseover", () => btn.classList.add("wiggle"));
    btn.addEventListener("animationend", () => btn.classList.remove("wiggle"));
  });

  // Confirm donation intent before form submission
  document.querySelectorAll("[data-donate-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      const swipesInput = form.querySelector('input[name="swipes"]');
      const amount = Number(swipesInput?.value || 1);
      const requester = form.dataset.requester || "this requester";
      const plural = amount === 1 ? "swipe" : "swipes";
      const message = `Donate ${amount} ${plural} to ${requester}?`;
      if (!window.confirm(message)) {
        event.preventDefault();
      }
    });
  });

  // Password eye toggle
  document.querySelectorAll("[data-eye-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrapper = btn.closest(".hf-input-eye-wrapper");
      const input = wrapper?.querySelector("input");
      if (!input) {
        return;
      }
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      btn.classList.toggle("hf-eye-open", isHidden);
    });
  });
});
