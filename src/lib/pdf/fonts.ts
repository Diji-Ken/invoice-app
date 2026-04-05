import { Font } from '@react-pdf/renderer';

export const FONT_FAMILY = 'NotoSansJP';

Font.register({
  family: FONT_FAMILY,
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v56/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v56/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf',
      fontWeight: 700,
    },
  ],
});
