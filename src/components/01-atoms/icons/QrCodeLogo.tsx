import type { SVGProps } from "react";

export const QRCodeLogo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="242"
      height="242"
      viewBox="0 0 242 242"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="QR Code">
        <g id="Borders">
          <path
            id="Vector 1"
            d="M34.4711 1H13C6.37258 1 1 6.37258 1 13V34.4711"
            stroke="#B1EF42"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            id="Vector 2"
            d="M241 34.4711L241 13C241 6.37258 235.627 1 229 0.999999L207.529 0.999999"
            stroke="#B1EF42"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            id="Vector 3"
            d="M207.529 241L229 241C235.627 241 241 235.627 241 229L241 207.529"
            stroke="#B1EF42"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            id="Vector 4"
            d="M1 207.529L1 229C1 235.627 6.37258 241 13 241L34.4711 241"
            stroke="#B1EF42"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g id="Highlight" style={{ mixBlendMode: "soft-light" }}>
          <path
            d="M13 17C13 14.7909 14.7909 13 17 13H225C227.209 13 229 14.7909 229 17V225C229 227.209 227.209 229 225 229H17C14.7909 229 13 227.209 13 225V17Z"
            fill="#F5FFFF"
          />
        </g>
      </g>
    </svg>
  );
};
