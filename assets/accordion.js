document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll("[data-product-accordion]");

  accordions.forEach((accordion) => {
    const triggers = accordion.querySelectorAll(".accordion-trigger");

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";
        const panelId = trigger.getAttribute("aria-controls");
        const panel = document.getElementById(panelId);

        const plusIcon = trigger.querySelector(".accordion-icon-plus");
        const minusIcon = trigger.querySelector(".accordion-icon-minus");

        trigger.setAttribute("aria-expanded", String(!isExpanded));

        panel.classList.toggle("hidden");

        if (isExpanded) {
          plusIcon.classList.remove("opacity-0");
          minusIcon.classList.add("opacity-0");
        } else {
          plusIcon.classList.add("opacity-0");
          minusIcon.classList.remove("opacity-0");
        }
      });
    });
  });
});
