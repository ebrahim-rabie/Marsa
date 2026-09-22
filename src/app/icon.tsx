import { ImageResponse } from 'next/og';

export const runtime = 'edge';

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
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F4C5C',
          borderRadius: 6,
        }}
      >
        <svg
          viewBox="4 24 92 72"
          width="24"
          height="24"
          style={{ display: 'block' }}
        >
          <path
            fill="#FFFFFF"
            d="M10 90V30h80v60H76V44H57v46H43V44H24v46z"
          />
          <rect x="57" y="44" width="19" height="46" fill="#F2B01E" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
