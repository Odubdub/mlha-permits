import { height } from '@mui/system';
import React from 'react';

const PillarSvg = ({ height = 13, topColor, bottomColor }) => {
  console.log('PillarSvg', height, topColor, bottomColor);
  return (
    <svg
      width="18"
      height={height + 30}
      viewBox={`0 0 18 ${30 + height}`}
      style={{ transition: 'all 0.12s ease-in-out', transform: 'translate(6px,0)' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Dynamic Shape</title>
      <defs>
        <linearGradient x1="50%" y1="3.67761377e-14%" x2="50%" y2="100%" id="linearGradient-1">
          <stop stopColor={topColor} offset="0%" />
          <stop stopColor={bottomColor} offset="100%" />
        </linearGradient>
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d={`M10.9970574,${height + 21.003308} C10.996986,${height + 23.8233697} 12.4594825,${
            height + 26.4338971
          } 14.8466348,${height + 27.9093} L15.0968579,${height + 28.057841} C15.9548221,${
            height + 28.5466564
          } 16.9264596,${height + 29.1940428} 18,${height + 30} L0,${height + 30} C0.93934787,${
            height + 29.2947874
          } 1.79617047,${height + 28.7109809} 2.57046781,${height + 28.24858} L2.89725696,${
            height + 28.057841
          } C5.43203148,${height + 26.6136846} 6.99713129,${height + 23.9206132} 6.99705743,${
            height + 21.003308
          } L6.99705743,8.99669176 C6.99712883,6.17663007 5.53463238,3.5661026 3.14748011,2.09069971 L2.89725696,1.94215897 C2.03929274,1.45334353 1.07354042,0.805957206 0,0 L18,0 C17.0606521,0.705212555 16.1993237,1.28901928 15.4238999,1.75142017 L15.0968579,1.94215897 C12.5620834,3.38631538 10.9969836,6.07938657 10.9970574,8.99669176 L10.9970574,${
            height + 21.003308
          } Z`}
          id="path"
          fill="url(#linearGradient-1)"
        />
      </g>
    </svg>
  );
};
export default PillarSvg;
