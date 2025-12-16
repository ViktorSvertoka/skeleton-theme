document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".product");
  if (!root || typeof Swiper === "undefined") return;

  const data = window.__PRODUCT_DATA__;
  if (!data) return;

  const thumbsEl = root.querySelector(".product__thumbs");
  const mainEl = root.querySelector(".product__inner");

  const thumbsSwiper = new Swiper(thumbsEl, {
    slidesPerView: 4,
    spaceBetween: 12,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      768: {
        slidesPerView: 5,
        spaceBetween: 12,
      },
      1280: {
        slidesPerView: 5,
        direction: "vertical",
        spaceBetween: 0,
      },
    },
  });

  const mainSwiper = new Swiper(mainEl, {
    slidesPerView: 1,
    grabCursor: true,
    allowTouchMove: false,
  });

  const colorButtons = [...root.querySelectorAll(".product__button")];
  const sizeButtons = [...root.querySelectorAll(".product__sizes-btn")];

  const variantInput = root.querySelector(".variant-id-input");
  const priceEl = root.querySelector(".product__price");
  const compareEl = root.querySelector(".product__compare");

  if (!colorButtons.length || !sizeButtons.length) return;

  let activeColor =
    colorButtons.find((b) => b.classList.contains("is-active"))?.dataset
      .color || colorButtons[0].dataset.color;

  let activeSize =
    sizeButtons.find((b) => b.classList.contains("is-active"))?.dataset.size ||
    sizeButtons[0].dataset.size;

  let currentImages = [];

  function setActive(buttons, activeBtn) {
    buttons.forEach((btn) => {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-pressed", "false");
    });

    activeBtn.classList.add("is-active");
    activeBtn.setAttribute("aria-pressed", "true");
  }

  function renderMain(img) {
    if (!img) return;

    mainSwiper.removeAllSlides();
    mainSwiper.appendSlide(`
      <div class="swiper-slide product__main-slide flex items-center justify-center">
        <img
          src="${img.src}"
          alt="Model variants"
          class="product__image w-(--size-343) h-(--size-343) object-cover lg:w-(--size-536) lg:h-(--size-536) rounded-lg"
        />
      </div>
    `);

    mainSwiper.update();
    mainSwiper.slideTo(0, 0);
  }

  function renderGallery(color) {
    currentImages = data.media.filter((m) => m.color === color).slice(0, 5);

    thumbsSwiper.removeAllSlides();

    currentImages.forEach((img, index) => {
      thumbsSwiper.appendSlide(`
        <div class="swiper-slide product__thumb-slide h-(--size-88)! w-(--size-88)! flex items-center justify-center" 
          data-index="${index}">
          <img
            role="button"
            src="${img.thumb}"
            alt="Model variants"
            class="product__image w-(--size-88) h-(--size-88) object-cover rounded-lg"
          />
        </div>
      `);
    });

    thumbsSwiper.update();
    renderMain(currentImages[0]);
  }

  function findVariant() {
    return data.variants.find(
      (v) => v.option1.toLowerCase() === activeColor && v.option2 === activeSize
    );
  }

  function updateVariant() {
    const variant = findVariant();
    if (!variant) return;

    variantInput.value = variant.id;
    priceEl.textContent = Shopify.formatMoney(variant.price);

    if (variant.compare_at_price > variant.price) {
      compareEl.style.display = "";
      compareEl.textContent = Shopify.formatMoney(variant.compare_at_price);
    } else {
      compareEl.style.display = "none";
    }
  }

  thumbsSwiper.on("click", () => {
    const idx = thumbsSwiper.clickedIndex;
    if (idx == null) return;
    renderMain(currentImages[idx]);
  });

  colorButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", "false");

    btn.addEventListener("click", () => {
      setActive(colorButtons, btn);
      activeColor = btn.dataset.color;

      renderGallery(activeColor);
      updateVariant();
    });
  });

  sizeButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", "false");

    btn.addEventListener("click", () => {
      setActive(sizeButtons, btn);
      activeSize = btn.dataset.size;

      updateVariant();
    });
  });

  const initialColorBtn = colorButtons.find(
    (b) => b.dataset.color === activeColor
  );
  const initialSizeBtn = sizeButtons.find((b) => b.dataset.size === activeSize);

  if (initialColorBtn) setActive(colorButtons, initialColorBtn);
  if (initialSizeBtn) setActive(sizeButtons, initialSizeBtn);

  renderGallery(activeColor);
  updateVariant();
});
