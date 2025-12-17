document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll("[data-product-accordion]");

  accordions.forEach((accordion) => {
    const triggers = accordion.querySelectorAll(".accordion-trigger");

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";
        const panelId = trigger.getAttribute("aria-controls");
        const panel = document.getElementById(panelId);

        if (!panel) return;

        const plusIcon = trigger.querySelector(".accordion-icon-plus");
        const minusIcon = trigger.querySelector(".accordion-icon-minus");

        const nextState = !isExpanded;
        trigger.setAttribute("aria-expanded", String(nextState));

        panel.classList.toggle("hidden", !nextState);
        panel.setAttribute("aria-hidden", String(!nextState));

        if (plusIcon && minusIcon) {
          plusIcon.classList.toggle("opacity-0", nextState);
          minusIcon.classList.toggle("opacity-0", !nextState);
        }
      });
    });
  });
});
