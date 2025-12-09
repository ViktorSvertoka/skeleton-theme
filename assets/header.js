const headerMenuLinks = [
  { label: "New & Featured", url: "#" },
  { label: "Men", url: "#" },
  { label: "Women", url: "#" },
  { label: "Kids", url: "#" },
];

const renderHeaderMenu = (container) => {
  if (!container) return;

  container.innerHTML = headerMenuLinks
    .map(
      (link) => `
        <li class="header__item">
          <a
            href="${link.url}"
            class="header__link inline-block text-sm font-medium text-dark transition-transform duration-300 hover:scale-110"
          >
            ${link.label}
          </a>
        </li>
      `
    )
    .join("");
};

const initHeaderMenuToggle = (
  toggleBtn,
  nav,
  overlay,
  menuContainer,
  closeBtn
) => {
  if (!toggleBtn || !nav || !menuContainer) return;

  const mediaQuery = window.matchMedia("(min-width: 768px)");
  let isMenuOpen = false;

  const applyMobileState = (isOpen) => {
    if (isOpen) {
      nav.classList.add("translate-x-0");
      nav.classList.remove("translate-x-full", "pointer-events-none");
      overlay?.classList.add("opacity-100");
      overlay?.classList.remove("opacity-0", "pointer-events-none");
      nav.setAttribute("aria-hidden", "false");
      document.body.classList.add("overflow-hidden");
    } else {
      nav.classList.add("translate-x-full", "pointer-events-none");
      nav.classList.remove("translate-x-0");
      overlay?.classList.add("opacity-0", "pointer-events-none");
      overlay?.classList.remove("opacity-100");
      nav.setAttribute("aria-hidden", "true");
      document.body.classList.remove("overflow-hidden");
    }
  };

  const openMenu = () => {
    if (mediaQuery.matches || isMenuOpen) return;
    isMenuOpen = true;
    applyMobileState(true);
  };

  const closeMenu = ({ force = false } = {}) => {
    if (!isMenuOpen && !force) return;
    isMenuOpen = false;
    applyMobileState(false);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  toggleBtn.addEventListener("click", toggleMenu);
  closeBtn?.addEventListener("click", () => closeMenu());
  overlay?.addEventListener("click", () => closeMenu());

  menuContainer.addEventListener("click", (event) => {
    if (mediaQuery.matches) return;
    const link = event.target.closest("a");
    if (link) {
      closeMenu();
    }
  });

  const handleBreakpointChange = (event) => {
    if (event.matches) {
      isMenuOpen = true;
      nav.classList.remove("translate-x-full", "pointer-events-none");
      nav.classList.add("translate-x-0");
      nav.setAttribute("aria-hidden", "false");
      overlay?.classList.add("opacity-0", "pointer-events-none");
      overlay?.classList.remove("opacity-100");
      document.body.classList.remove("overflow-hidden");
    } else {
      closeMenu({ force: true });
      isMenuOpen = false;
    }
  };

  mediaQuery.addEventListener("change", handleBreakpointChange);
  handleBreakpointChange(mediaQuery);
};

const initHeader = () => {
  const menuContainer = document.querySelector("[data-header-menu]");
  const toggleBtn = document.querySelector("[data-header-menu-toggle]");
  const nav = document.querySelector("[data-header-nav]");
  const overlay = document.querySelector("[data-header-overlay]");
  const closeBtn = document.querySelector("[data-header-menu-close]");

  renderHeaderMenu(menuContainer);
  initHeaderMenuToggle(toggleBtn, nav, overlay, menuContainer, closeBtn);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeader);
} else {
  initHeader();
}
