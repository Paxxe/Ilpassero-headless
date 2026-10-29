import {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y, Autoplay, Keyboard, Pagination} from 'swiper/modules';
import type {Swiper as SwiperInstance} from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import {ProductItem} from '~/components/ProductItem';
import type {CarouselOptions} from '~/lib/sanity/types';
import type {ProductCardFragment} from 'storefrontapi.generated';

const GAP = 20;

/** Swiper carousel of product cards; every option comes from the Studio. */
export function ProductCarousel({
  products,
  options,
  header,
  tabletMax = 3,
}: {
  products: ProductCardFragment[];
  /** Most slides between 720px and 1024px (lower it when the carousel is half width). */
  tabletMax?: number;
  options?: CarouselOptions | null;
  /** Section header; receives the arrows so they sit next to the title. */
  header: (arrows: React.ReactNode) => React.ReactNode;
}) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const slidesDesktop = options?.slidesDesktop ?? 4;
  const slidesMobile = options?.slidesMobile ?? 1.5;
  const showArrows = options?.showArrows ?? true;
  // Looping needs more slides than the visible ones
  const loop = Boolean(options?.loop) && products.length > slidesDesktop;

  const arrows = showArrows ? (
    <div className="cms-rail__controls">
      <button type="button" aria-label="Prodotti precedenti" onClick={() => swiper?.slidePrev()}>
        ←
      </button>
      <button type="button" aria-label="Prodotti successivi" onClick={() => swiper?.slideNext()}>
        →
      </button>
    </div>
  ) : null;

  return (
    <>
      {header(arrows)}
      <div
        className="cms-carousel"
        // Slide widths before Swiper initialises, to avoid a layout jump
        style={
          {
            '--slides-mobile': slidesMobile,
            '--slides-tablet': Math.min(slidesDesktop, tabletMax),
            '--slides-desktop': slidesDesktop,
            '--gap': `${GAP}px`,
          } as React.CSSProperties
        }
      >
        <Swiper
          modules={[A11y, Autoplay, Keyboard, Pagination]}
          onSwiper={setSwiper}
          spaceBetween={GAP}
          slidesPerView={slidesMobile}
          breakpoints={{
            720: {slidesPerView: Math.min(slidesDesktop, tabletMax)},
            1024: {slidesPerView: slidesDesktop},
          }}
          loop={loop}
          keyboard={{enabled: true}}
          autoplay={
            options?.autoplay
              ? {delay: (options.autoplayDelay ?? 4) * 1000, pauseOnMouseEnter: true, disableOnInteraction: false}
              : false
          }
          pagination={options?.showPagination ? {clickable: true} : false}
          a11y={{prevSlideMessage: 'Prodotto precedente', nextSlideMessage: 'Prodotto successivo'}}
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <ProductItem product={product} loading={index < slidesDesktop ? 'eager' : 'lazy'} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
