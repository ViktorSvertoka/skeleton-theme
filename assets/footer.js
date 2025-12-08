const footerEl = document.querySelector(".footer");
const spriteUrl = footerEl?.dataset.spriteUrl;

const updateIconHref = (useEl, iconName) => {
  if (!useEl || !spriteUrl) return;

  useEl.setAttribute("href", `${spriteUrl}#${iconName}`);

  const svg = useEl.closest("svg");
  if (svg) {
    svg.style.display = "none";
    requestAnimationFrame(() => {
      svg.style.display = "";
    });
  }
};

const initFooterAccordionIcons = () => {
  const items = document.querySelectorAll(".footer__details");

  items.forEach((item) => {
    const iconUse = item.querySelector(".footer__use");
    if (!iconUse) return;

    item.addEventListener("toggle", () => {
      if (window.innerWidth >= 1280) return;

      const iconName = item.open ? "arrow-up" : "arrow-down";
      updateIconHref(iconUse, iconName);
    });
  });
};

const syncFooterAccordionState = () => {
  const items = document.querySelectorAll(".footer__details");
  const isDesktop = window.innerWidth >= 1280;

  items.forEach((item) => {
    item.open = isDesktop;
  });
};

const updateFooterYear = () => {
  const year = new Date().getFullYear();
  document.querySelectorAll(".js-year").forEach((el) => {
    el.textContent = year;
  });
};

const initFooter = () => {
  initFooterAccordionIcons();
  syncFooterAccordionState();
  updateFooterYear();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncFooterAccordionState, 150);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFooter);
} else {
  initFooter();
}
