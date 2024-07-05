import type { SVGProps } from "react";

export const CopyIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="copy-solid 1">
        <path
          id="Vector"
          d="M18.25 0H27.9453C28.9375 0 29.8906 0.398438 30.5938 1.10156L35.8984 6.40625C36.6016 7.10938 37 8.0625 37 9.05469V26.25C37 28.3203 35.3203 30 33.25 30H18.25C16.1797 30 14.5 28.3203 14.5 26.25V3.75C14.5 1.67969 16.1797 0 18.25 0ZM5.75 10H12V15H7V35H22V32.5H27V36.25C27 38.3203 25.3203 40 23.25 40H5.75C3.67969 40 2 38.3203 2 36.25V13.75C2 11.6797 3.67969 10 5.75 10Z"
          fill="#F5FFFF"
        />
      </g>
    </svg>
  );
};
