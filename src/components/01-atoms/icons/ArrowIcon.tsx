import { type SVGProps } from "react";

export enum ArrowIconVariant {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

interface ArrowIconProps {
  props?: SVGProps<SVGSVGElement>;
  variant?: ArrowIconVariant;
}

export const ArrowIcon = ({
  props,
  variant = ArrowIconVariant.DOWN,
}: ArrowIconProps) => {
  const ArrowIcons: Partial<Record<ArrowIconVariant, React.ReactElement>> = {
    [ArrowIconVariant.DOWN]: (
      <svg
        {...props}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Chevron down">
          <path
            id="Vector"
            d="M18.2344 31.7656C19.2109 32.7422 20.7969 32.7422 21.7734 31.7656L36.7734 16.7656C37.75 15.7891 37.75 14.2031 36.7734 13.2266C35.7969 12.25 34.2109 12.25 33.2344 13.2266L20 26.4609L6.76562 13.2344C5.78906 12.2578 4.20312 12.2578 3.22656 13.2344C2.25 14.2109 2.25 15.7969 3.22656 16.7734L18.2266 31.7734L18.2344 31.7656Z"
            fill="#F5FFFF"
          />
        </g>
      </svg>
    ),
    [ArrowIconVariant.UP]: (
      <svg
        {...props}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="chevron-down-solid">
          <path
            id="Vector"
            d="M6.5297 2.47051C6.23673 2.17754 5.76095 2.17754 5.46798 2.47051L0.96798 6.97051C0.675012 7.26348 0.675012 7.73926 0.96798 8.03223C1.26095 8.3252 1.73673 8.3252 2.0297 8.03223L6.00001 4.06191L9.97032 8.02988C10.2633 8.32285 10.7391 8.32285 11.032 8.02988C11.325 7.73691 11.325 7.26113 11.032 6.96816L6.53204 2.46816L6.5297 2.47051Z"
            fill="#F5FFFF"
          />
        </g>
      </svg>
    ),
    [ArrowIconVariant.LEFT]: (
      <svg
        {...props}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="chevron-left-solid 1">
          <path
            id="Vector"
            d="M4.29297 7.29374C3.90234 7.68437 3.90234 8.31874 4.29297 8.70937L10.293 14.7094C10.6836 15.1 11.318 15.1 11.7086 14.7094C12.0992 14.3187 12.0992 13.6844 11.7086 13.2937L6.41484 7.99999L11.7055 2.70624C12.0961 2.31562 12.0961 1.68124 11.7055 1.29062C11.3148 0.899994 10.6805 0.899994 10.2898 1.29062L4.28984 7.29062L4.29297 7.29374Z"
            fill="currentColor"
          />
        </g>
      </svg>
    ),
    [ArrowIconVariant.RIGHT]: (
      <svg
        {...props}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="chevron-right-solid 1">
          <path
            id="Vector"
            d="M8.78145 5.47031C9.07441 5.76328 9.07441 6.23906 8.78145 6.53203L4.28145 11.032C3.98848 11.325 3.5127 11.325 3.21973 11.032C2.92676 10.7391 2.92676 10.2633 3.21973 9.97031L7.19004 6L3.22207 2.02969C2.9291 1.73672 2.9291 1.26094 3.22207 0.967969C3.51504 0.675 3.99082 0.675 4.28379 0.967969L8.78379 5.46797L8.78145 5.47031Z"
            fill="currentColor"
            fillOpacity="0.70"
          />
        </g>
      </svg>
    ),
  };

  return ArrowIcons[variant] || <></>;
};
