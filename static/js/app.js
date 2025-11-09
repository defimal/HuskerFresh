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
});
