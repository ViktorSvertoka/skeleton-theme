document.addEventListener("DOMContentLoaded", () => {
  const swiperEl = document.querySelector(".recommendations-swiper");
  if (!swiperEl || typeof Swiper === "undefined") return;

  const section = swiperEl.closest("section");
  const prevBtn = section.querySelector(".recommendations-prev");
  const nextBtn = section.querySelector(".recommendations-next");

  const updateNavVisibility = (swiper) => {
    if (swiper.isBeginning) {
      prevBtn.classList.add("opacity-0", "pointer-events-none");
    } else {
      prevBtn.classList.remove("opacity-0", "pointer-events-none");
    }

    if (swiper.isEnd) {
      nextBtn.classList.add("opacity-0", "pointer-events-none");
    } else {
      nextBtn.classList.remove("opacity-0", "pointer-events-none");
    }
  };

  const swiper = new Swiper(swiperEl, {
    speed: 600,
    spaceBetween: 24,
    slidesPerView: "auto",

    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },

    breakpoints: {
      320: {
        slidesPerView: 1.1,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 16,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },

    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    observer: true,
    observeParents: true,

    on: {
      init(swiperInstance) {
        updateNavVisibility(swiperInstance);
      },
      slideChange(swiperInstance) {
        updateNavVisibility(swiperInstance);
      },
      reachBeginning(swiperInstance) {
        updateNavVisibility(swiperInstance);
      },
      reachEnd(swiperInstance) {
        updateNavVisibility(swiperInstance);
      },
    },
  });
});
