import lottie from "lottie-web/build/player/lottie_light";
import { useEffect, forwardRef } from "react";

const LottieAnimation = forwardRef((props:any, gifRef:any) => {
  const { className, style, animationData } = props;

  useEffect(() => {
   const instance= lottie.loadAnimation({
      container: gifRef?.current,
      renderer: 'svg',
      animationData: animationData,
    });
    return () => instance.destroy();
  }, []);
  return (
    <span  ref={gifRef} className={className} style={style}></span>
  );
});
LottieAnimation.displayName = 'LottieAnimation';
export default LottieAnimation;
