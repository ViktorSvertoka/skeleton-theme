document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".product");
  if (!root || typeof Swiper === "undefined") return;

  const data = window.__PRODUCT_DATA__;
  if (!data) return;

  const thumbsEl = root.querySelector(".product__thumbs");
  const mainEl = root.querySelector(".product__inner");

  const thumbsSwiper = new Swiper(thumbsEl, {
    slidesPerView: "auto",
    spaceBetween: 16,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      1280: {
        slidesPerView: 5,
        direction: "vertical",
        spaceBetween: 0,
      },
    },
  });

  const mainSwiper = new Swiper(mainEl, {
    slidesPerView: 1,
    thumbs: { swiper: thumbsSwiper },
    grabCursor: true,
  });

  const colorButtons = [...root.querySelectorAll(".product__button")];
  const sizeButtons = [...root.querySelectorAll(".product__sizes-btn")];

  const variantInput = root.querySelector(".variant-id-input");
  const priceEl = root.querySelector(".product__price");
  const compareEl = root.querySelector(".product__compare");

  let activeColor = colorButtons[0]?.dataset.color;
  let activeSize = sizeButtons[0]?.dataset.size;

  function renderGallery(color) {
    const images = data.media.filter((m) => m.color === color).slice(0, 5);

    thumbsSwiper.removeAllSlides();
    mainSwiper.removeAllSlides();

    images.forEach((img) => {
      mainSwiper.appendSlide(`
        <div class="swiper-slide product__main-slide">
          <img src="${img.src}" class="product__image w-[536px] h-[536px]" />
        </div>
      `);

      thumbsSwiper.appendSlide(`
        <div class="swiper-slide product__thumb-slide">
          <img src="${img.thumb}" class="product__image w-[88px] h-[88px]" />
        </div>
      `);
    });

    mainSwiper.update();
    thumbsSwiper.update();
    mainSwiper.slideTo(0);
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

  colorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      colorButtons.forEach((b) => b.classList.remove("product__selected"));
      btn.classList.add("product__selected");

      activeColor = btn.dataset.color;
      renderGallery(activeColor);
      updateVariant();
    });
  });

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((b) => b.classList.remove("product__selected"));
      btn.classList.add("product__selected");

      activeSize = btn.dataset.size;
      updateVariant();
    });
  });

  renderGallery(activeColor);
  updateVariant();
});
