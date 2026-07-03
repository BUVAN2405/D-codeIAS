import { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Crown (Red) */}
      <g>
        {/* Crown Body */}
        <path
          d="M 36,26 
             L 30,13 
             L 39,21 
             L 50,7 
             L 61,21 
             L 70,13 
             L 64,26 
             Z"
          fill="#D31218"
        />
        {/* Five small circles on top of the crown peaks */}
        <circle cx="30" cy="13" r="1.5" fill="#D31218" />
        <circle cx="39" cy="21" r="1.2" fill="#D31218" />
        <circle cx="50" cy="7" r="1.8" fill="#D31218" />
        <circle cx="61" cy="21" r="1.2" fill="#D31218" />
        <circle cx="70" cy="13" r="1.5" fill="#D31218" />
        
        {/* Crown base horizontal white band */}
        <path d="M 36.5,24 L 63.5,24" stroke="white" strokeWidth="1" strokeLinecap="round" />
        
        {/* Small decorative white dots on crown base */}
        <circle cx="43" cy="24" r="0.5" fill="white" />
        <circle cx="50" cy="24" r="0.6" fill="white" />
        <circle cx="57" cy="24" r="0.5" fill="white" />
      </g>

      {/* Styled Capital Letter 'D' (Navy Blue) */}
      {/* Compound path with evenodd fill rule for transparent inner cutout */}
      <path
        d="M 35,26 
           L 55,26 
           L 55,29 
           L 44,29 
           L 44,71 
           L 55,71 
           L 55,74 
           L 35,74 
           L 35,71 
           L 40,71 
           L 40,29 
           L 35,29 
           Z 
           M 43,26 
           C 61,26, 76,35, 76,50 
           C 76,65, 61,74, 43,74 
           Z 
           M 44,32 
           C 56,32, 67,40, 67,50 
           C 67,60, 56,68, 44,68 
           Z"
        fill="#0D2C54"
        fillRule="evenodd"
      />

      {/* Stylized Open Book at the Base (Red and Navy Blue) */}
      <g>
        {/* Left Book Wing - Blue */}
        <path
          d="M 50,75 
             C 41,71, 31,73, 25,80 
             C 32,75, 41,74, 50,77 
             Z"
          fill="#0D2C54"
        />
        {/* Right Book Wing - Blue */}
        <path
          d="M 50,75 
             C 59,71, 69,73, 75,80 
             C 68,75, 59,74, 50,77 
             Z"
          fill="#0D2C54"
        />

        {/* Left Book Wing - Red */}
        <path
          d="M 50,79 
             C 41,75, 31,77, 25,84 
             C 32,79, 41,78, 50,81 
             Z"
          fill="#D31218"
        />
        {/* Right Book Wing - Red */}
        <path
          d="M 50,79 
             C 59,75, 69,77, 75,84 
             C 68,79, 59,78, 50,81 
             Z"
          fill="#D31218"
        />
      </g>
    </svg>
  );
}
