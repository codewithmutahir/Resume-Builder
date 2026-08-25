import { Font } from '@react-pdf/renderer';

let registered = false;

/**
 * Register curated fonts for @react-pdf (once).
 * Uses files hosted from /public/fonts so preview and PDF stay aligned.
 */
export const registerPdfFonts = () => {
  if (registered) return;
  if (typeof window === 'undefined') return;

  const origin = window.location.origin;
  const src = (file) => `${origin}/fonts/${file}`;

  try {
    Font.register({
      family: 'Inter',
      fonts: [
        { src: src('Inter-Regular.woff'), fontWeight: 400 },
        { src: src('Inter-Bold.woff'), fontWeight: 700 },
      ],
    });

    Font.register({
      family: 'Lora',
      fonts: [
        { src: src('Lora-Regular.woff'), fontWeight: 400 },
        { src: src('Lora-Bold.woff'), fontWeight: 700 },
        { src: src('Lora-Italic.woff'), fontWeight: 400, fontStyle: 'italic' },
      ],
    });

    Font.register({
      family: 'PlayfairDisplay',
      fonts: [
        { src: src('PlayfairDisplay-Regular.woff'), fontWeight: 400 },
        { src: src('PlayfairDisplay-Bold.woff'), fontWeight: 700 },
      ],
    });

    Font.register({
      family: 'Poppins',
      fonts: [
        { src: src('Poppins-Regular.woff'), fontWeight: 400 },
        { src: src('Poppins-Bold.woff'), fontWeight: 700 },
      ],
    });

    Font.register({
      family: 'SourceSerif4',
      fonts: [
        { src: src('SourceSerif4-Regular.woff'), fontWeight: 400 },
        { src: src('SourceSerif4-Bold.woff'), fontWeight: 700 },
        { src: src('SourceSerif4-Italic.woff'), fontWeight: 400, fontStyle: 'italic' },
      ],
    });

    Font.register({
      family: 'SourceSans3',
      fonts: [
        { src: src('SourceSans3-Regular.woff'), fontWeight: 400 },
        { src: src('SourceSans3-Bold.woff'), fontWeight: 700 },
        { src: src('SourceSans3-Italic.woff'), fontWeight: 400, fontStyle: 'italic' },
      ],
    });

    // Avoid hyphenation crashes on custom fonts in some react-pdf versions
    Font.registerHyphenationCallback((word) => [word]);

    registered = true;
  } catch (error) {
    console.error('Failed to register PDF fonts:', error);
  }
};
