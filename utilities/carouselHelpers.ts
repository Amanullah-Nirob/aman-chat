export const settings = {
    className: "start",
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 3,
    initialSlide: 5,
    arrows: false,
    responsive: [
      {
          breakpoint: 1024,
          settings: {
              slidesToShow: 4,
              slidesToScroll: 3,
          },
      },
      {
          breakpoint: 1200,
          settings: {
              slidesToShow: 5,
              slidesToScroll: 3,
          },
      },
  ],
};
  