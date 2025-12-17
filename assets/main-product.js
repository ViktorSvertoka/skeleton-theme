document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".product");
  if (!root || typeof Swiper === "undefined") return;

  const data = window.__PRODUCT_DATA__;
  const products = Array.isArray(data?.products) ? data.products : [];
  if (!products.length) return;

  const thumbsEl = root.querySelector(".product__thumbs");
  const mainEl = root.querySelector(".product__inner");
  if (!thumbsEl || !mainEl) return;

  const titleEl = root.querySelector(".product__title");
  const breadcrumbTitleEl = root.querySelector(".product__breadcrumb-title");
  const descriptionEl = root.querySelector(".product__description");
  const sizeLabelEl = root.querySelector(".product__size-label");
  const sizesListEl = root.querySelector(".product__sizes-list");
  const variantInput = root.querySelector(".variant-id-input");
  const priceEl = root.querySelector(".product__price");
  const compareEl = root.querySelector(".product__compare");

  const colorButtons = [
    ...root.querySelectorAll(".product__button[data-product-id]"),
  ];

  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  const thumbsSwiper = new Swiper(thumbsEl, {
    slidesPerView: 4,
    spaceBetween: 12,
    freeMode: !isMobile,
    watchSlidesProgress: true,
    loop: isMobile,
    initialSlide: 0,
    centeredSlides: false,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
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

  const productsMap = new Map();
  products.forEach((product) => {
    if (!product || !product.id) return;
    productsMap.set(String(product.id), product);
  });

  const moneyFormat = data.moneyFormat;
  const moneyCurrency = data.moneyCurrency || "USD";
  const intlFormatter =
    typeof Intl !== "undefined"
      ? new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: moneyCurrency,
        })
      : null;

  let activeProductId =
    (data?.activeProductId && String(data.activeProductId)) ||
    String(products[0].id);
  let activeProduct =
    productsMap.get(activeProductId) || productsMap.values().next().value;

  if (!activeProduct) return;

  activeProductId = String(activeProduct.id);

  let currentImages = [];
  let sizeButtons = [];
  let activeSize = null;

  function setActive(buttons, activeBtn) {
    buttons.forEach((btn) => {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-pressed", "false");
    });

    if (!activeBtn) return;

    activeBtn.classList.add("is-active");
    activeBtn.setAttribute("aria-pressed", "true");
  }

  function renderMain(img) {
    mainSwiper.removeAllSlides();

    if (!img) {
      mainSwiper.update();
      return;
    }

    mainSwiper.appendSlide(`
      <div class="swiper-slide product__main-slide">
        <img
          src="${img.src}"
          alt="${img.alt || "Product image"}"
          class="product__image w-(--size-343) h-(--size-343) object-cover lg:w-(--size-536) lg:h-(--size-536) rounded-lg"
        />
      </div>
    `);

    mainSwiper.update();
    mainSwiper.slideTo(0, 0);
  }

  function renderGallery(product) {
    currentImages = (product?.media || []).slice(0, 5);

    thumbsSwiper.removeAllSlides();

    currentImages.forEach((img, index) => {
      thumbsSwiper.appendSlide(`
        <div class="swiper-slide product__thumb-slide h-(--size-88)! w-(--size-88)!" 
          data-index="${index}">
          <img
            role="button"
            src="${img.thumb}"
            alt="${img.alt || "Product image"}"
            class="product__image w-(--size-88) h-(--size-88) object-cover rounded-lg"
          />
        </div>
      `);
    });

    thumbsSwiper.update();
    thumbsSwiper.slideTo(0, 0);
    renderMain(currentImages[0]);
  }

  function findVariant() {
    if (!activeProduct || !Array.isArray(activeProduct.variants)) return null;

    const optionKey = `option${activeProduct.sizeOptionPosition || 1}`;
    let variant = null;

    if (activeSize) {
      variant = activeProduct.variants.find(
        (v) => v[optionKey] === activeSize
      );
    }

    if (!variant && activeProduct.defaultVariantId) {
      variant = activeProduct.variants.find(
        (v) => v.id === activeProduct.defaultVariantId
      );
    }

    if (!variant) {
      variant = activeProduct.variants[0];
    }

    return variant || null;
  }

  function formatMoney(value) {
    if (typeof Shopify !== "undefined" && Shopify.formatMoney) {
      return Shopify.formatMoney(value, moneyFormat);
    }

    if (intlFormatter) {
      return intlFormatter.format((Number(value) || 0) / 100);
    }

    const amount = ((Number(value) || 0) / 100).toFixed(2);
    return `$${amount}`;
  }

  function updateVariant() {
    const variant = findVariant();
    if (!variant || !variantInput) return;

    variantInput.value = variant.id;

    if (priceEl) {
      priceEl.textContent = formatMoney(variant.price);
    }

    if (compareEl) {
      if (variant.compare_at_price > variant.price) {
        compareEl.style.display = "";
        compareEl.textContent = formatMoney(variant.compare_at_price);
      } else {
        compareEl.style.display = "none";
      }
    }
  }

  function handleSizeButtonClick(btn) {
    setActive(sizeButtons, btn);
    activeSize = btn.dataset.size || null;
    updateVariant();
  }

  function renderSizes(product) {
    if (!sizesListEl) {
      sizeButtons = [];
      activeSize = null;
      updateVariant();
      return;
    }

    sizesListEl.innerHTML = "";
    sizeButtons = [];
    activeSize = null;

    const values = Array.isArray(product?.sizeValues)
      ? product.sizeValues
      : [];

    values.forEach((value) => {
      if (!value) return;
      const li = document.createElement("li");
      const btn = document.createElement("button");

      btn.type = "button";
      btn.className =
        "product__sizes-btn flex items-center justify-center h-(--size-52) w-full rounded-lg border border-stroke bg-white px-4 text-sm font-medium text-dark transition-colors hover:border-dark focus:outline-none";
      btn.dataset.size = value;
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = `UK ${value}`;

      btn.addEventListener("click", () => handleSizeButtonClick(btn));

      li.appendChild(btn);
      sizesListEl.appendChild(li);
      sizeButtons.push(btn);
    });

    if (sizeButtons.length) {
      handleSizeButtonClick(sizeButtons[0]);
    } else {
      updateVariant();
    }
  }

  function setActiveColorButton(productId) {
    colorButtons.forEach((btn) => {
      const isActive = String(btn.dataset.productId) === String(productId);
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function updateProductText(product) {
    if (titleEl) {
      titleEl.textContent = product?.title || "";
    }

    if (breadcrumbTitleEl) {
      breadcrumbTitleEl.textContent = product?.title || "";
    }

    if (descriptionEl) {
      descriptionEl.textContent = product?.description || "";
    }

    if (sizeLabelEl) {
      const optionName = product?.sizeOptionName || "Size";
      sizeLabelEl.textContent = `Select ${optionName}:`;
    }
  }

  function switchProduct(productId) {
    const nextProduct = productsMap.get(String(productId));
    if (!nextProduct) return;

    activeProductId = String(nextProduct.id);
    activeProduct = nextProduct;

    updateProductText(activeProduct);
    renderGallery(activeProduct);
    renderSizes(activeProduct);
    setActiveColorButton(activeProductId);
    updateVariant();
  }

  thumbsSwiper.on("click", () => {
    const idx = thumbsSwiper.clickedIndex;
    if (idx == null || !currentImages[idx]) return;
    renderMain(currentImages[idx]);
  });

  colorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      if (!productId || productId === activeProductId) return;
      switchProduct(productId);
    });
  });

  // Initialize view with the current product
  switchProduct(activeProductId);
});
