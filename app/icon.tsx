import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Target circles */}
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" opacity="0.3" />
          <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5" opacity="0.5" />
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <circle cx="12" cy="12" r="2" fill="white" />
          
          {/* Arrow */}
          <path
            d="M 18 6 L 12 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <polygon points="18,6 16,5 17,7" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}