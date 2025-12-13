(() => {
  const initReviewsSliders = (scope = document) => {
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper library missing for reviews slider.');
      return;
    }

    const sections = scope.querySelectorAll('[data-reviews-slider]');
    sections.forEach((section) => {
      const container = section.querySelector('[data-reviews-swiper]');
      if (!container || container.dataset.sliderInitialized === 'true') return;

      const nextButton = section.querySelector('[data-reviews-next]');
      const prevButton = section.querySelector('[data-reviews-prev]');
      const paginationEl = section.querySelector('[data-reviews-pagination]');

      container.dataset.sliderInitialized = 'true';

      new Swiper(container, {
        slidesPerView: 1,
        spaceBetween: 24,
        speed: 500,
        grabCursor: true,
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton
        },
        pagination: {
          el: paginationEl,
          clickable: true,
          bulletElement: 'button'
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 24
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 32
          }
        },
        on: {
          init(swiper) {
            section.classList.add('reviews-slider--ready');
          }
        }
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initReviewsSliders();
  });

  document.addEventListener('shopify:section:load', (event) => {
    initReviewsSliders(event.target);
  });
})();
