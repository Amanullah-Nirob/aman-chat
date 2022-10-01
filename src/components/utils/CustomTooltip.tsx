import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { ReactNode } from "react";

interface props {
  props: ReactNode
  className: string
}


const getCustomTooltip = (arrowStyles:any, tooltipStyles:any) =>
  styled(({ className, ...props }:props) => (
    <Tooltip children={} title={undefined} {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: { ...arrowStyles },
    [`& .${tooltipClasses.tooltip}`]: { ...tooltipStyles },
  }));

export default getCustomTooltip;
