export const settings = {
    className: "center",
    infinite: false,
    // centerPadding: "60px",
    slidesToShow: 4,
    swipeToSlide: true,
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
  