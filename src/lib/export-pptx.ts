import pptxgen from "pptxgenjs";
import { PitchDeck, Slide } from "@/types/pitch";
import { DECK_THEMES } from "./constants";

export async function exportDeckToPPTX(deck: PitchDeck): Promise<void> {
  const pptx = new pptxgen();
  const theme = DECK_THEMES[deck.themeId] || DECK_THEMES.midnight;

  pptx.layout = "LAYOUT_16x9";
  pptx.author = deck.companyName || "Pitch-Craft";
  pptx.title = deck.title;
  pptx.subject = `${deck.companyName} Investor Deck`;

  const cleanHex = (colorStr: string, fallback = "090D16") => {
    if (!colorStr) return fallback;
    const match = colorStr.replace("#", "").trim();
    if (match.length === 6 || match.length === 3) return match;
    return fallback;
  };

  const bgHex = cleanHex(theme.bgColor, theme.isDark ? "090D16" : "FFFFFF");
  const textHex = cleanHex(theme.textColor, theme.isDark ? "FFFFFF" : "1E293B");
  const accentHex = cleanHex(theme.accentColor, "38BDF8");
  const subtextHex = cleanHex(theme.subtextColor, "94A3B8");

  deck.slides.forEach((slide: Slide, index: number) => {
    const pptxSlide = pptx.addSlide();
    pptxSlide.background = { color: bgHex };

    // Header branding
    pptxSlide.addText(`${deck.companyName.toUpperCase()} | PITCH DECK`, {
      x: 0.8,
      y: 0.4,
      w: 8.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: accentHex,
      bold: true,
    });

    // Slide Title
    pptxSlide.addText(slide.title, {
      x: 0.8,
      y: 0.8,
      w: 11.5,
      h: 0.9,
      fontSize: 26,
      fontFace: "Arial",
      bold: true,
      color: textHex,
    });

    // Subtitle if available
    if (slide.subtitle) {
      pptxSlide.addText(slide.subtitle, {
        x: 0.8,
        y: 1.7,
        w: 11.5,
        h: 0.6,
        fontSize: 14,
        fontFace: "Arial",
        color: subtextHex,
      });
    }

    // Content rendering based on layout
    const contentStartY = slide.subtitle ? 2.5 : 2.0;

    if (slide.contentPoints && slide.contentPoints.length > 0) {
      const bulletItems = slide.contentPoints.map((point) => ({
        text: point,
        options: {
          fontSize: 14,
          color: textHex,
          bullet: { type: "bullet" as const, code: "2022" },
          spaceAfter: 12,
        },
      }));

      pptxSlide.addText(bulletItems, {
        x: 0.8,
        y: contentStartY,
        w: slide.metrics && slide.metrics.length > 0 ? 6.5 : 11.5,
        h: 4.0,
        valign: "top",
      });
    }

    // Metrics rendering (Side cards or bottom cards)
    if (slide.metrics && slide.metrics.length > 0) {
      const startX = slide.contentPoints && slide.contentPoints.length > 0 ? 7.8 : 0.8;
      const cardWidth = slide.contentPoints && slide.contentPoints.length > 0 ? 4.5 : 11.5 / Math.min(slide.metrics.length, 3);

      slide.metrics.slice(0, 4).forEach((metric, mIdx) => {
        const mY = slide.contentPoints && slide.contentPoints.length > 0 
          ? contentStartY + mIdx * 1.1
          : contentStartY + 2.0;
        const mX = slide.contentPoints && slide.contentPoints.length > 0 
          ? startX 
          : 0.8 + mIdx * (cardWidth + 0.3);

        pptxSlide.addShape(pptx.ShapeType.roundRect, {
          x: mX,
          y: mY,
          w: cardWidth - 0.2,
          h: 0.95,
          fill: { color: theme.isDark ? "1E293B" : "F1F5F9" },
          line: { color: accentHex, width: 1 },
          rectRadius: 0.08,
        });

        pptxSlide.addText(metric.value, {
          x: mX + 0.2,
          y: mY + 0.1,
          w: cardWidth - 0.5,
          h: 0.45,
          fontSize: 18,
          bold: true,
          color: accentHex,
        });

        pptxSlide.addText(metric.label, {
          x: mX + 0.2,
          y: mY + 0.52,
          w: cardWidth - 0.5,
          h: 0.35,
          fontSize: 11,
          color: subtextHex,
        });
      });
    }

    // Market Size (TAM / SAM / SOM) layout
    if (slide.marketSize) {
      const items = [
        { label: "TAM (Total Addressable)", val: slide.marketSize.tam, desc: slide.marketSize.tamDesc, color: accentHex },
        { label: "SAM (Serviceable Addressable)", val: slide.marketSize.sam, desc: slide.marketSize.samDesc, color: "818CF8" },
        { label: "SOM (Serviceable Obtainable)", val: slide.marketSize.som, desc: slide.marketSize.somDesc, color: "34D399" },
      ];

      items.forEach((item, i) => {
        const xPos = 0.8 + i * 3.9;
        pptxSlide.addShape(pptx.ShapeType.roundRect, {
          x: xPos,
          y: contentStartY + 0.3,
          w: 3.6,
          h: 3.2,
          fill: { color: theme.isDark ? "1E293B" : "F8FAFC" },
          line: { color: item.color, width: 1.5 },
          rectRadius: 0.1,
        });

        pptxSlide.addText(item.label, {
          x: xPos + 0.2,
          y: contentStartY + 0.5,
          w: 3.2,
          h: 0.4,
          fontSize: 11,
          color: subtextHex,
          bold: true,
        });

        pptxSlide.addText(item.val, {
          x: xPos + 0.2,
          y: contentStartY + 1.0,
          w: 3.2,
          h: 0.7,
          fontSize: 22,
          bold: true,
          color: item.color,
        });

        pptxSlide.addText(item.desc, {
          x: xPos + 0.2,
          y: contentStartY + 1.8,
          w: 3.2,
          h: 1.4,
          fontSize: 11,
          color: textHex,
        });
      });
    }

    // Team members layout
    if (slide.teamMembers && slide.teamMembers.length > 0) {
      slide.teamMembers.forEach((member, tIdx) => {
        const xPos = 0.8 + tIdx * 3.8;
        pptxSlide.addShape(pptx.ShapeType.roundRect, {
          x: xPos,
          y: contentStartY + 0.3,
          w: 3.5,
          h: 3.4,
          fill: { color: theme.isDark ? "1E293B" : "F8FAFC" },
          line: { color: accentHex, width: 1 },
          rectRadius: 0.1,
        });

        pptxSlide.addText(member.name, {
          x: xPos + 0.2,
          y: contentStartY + 0.6,
          w: 3.1,
          h: 0.4,
          fontSize: 16,
          bold: true,
          color: textHex,
        });

        pptxSlide.addText(member.role, {
          x: xPos + 0.2,
          y: contentStartY + 1.05,
          w: 3.1,
          h: 0.35,
          fontSize: 12,
          color: accentHex,
          bold: true,
        });

        if (member.bio) {
          pptxSlide.addText(member.bio, {
            x: xPos + 0.2,
            y: contentStartY + 1.5,
            w: 3.1,
            h: 1.8,
            fontSize: 10,
            color: subtextHex,
          });
        }
      });
    }

    // Slide footer page number
    pptxSlide.addText(`${index + 1} / ${deck.slides.length}`, {
      x: 11.5,
      y: 6.8,
      w: 1.0,
      h: 0.3,
      fontSize: 10,
      color: subtextHex,
      align: "right",
    });

    // Speaker notes
    if (slide.speakerNotes) {
      pptxSlide.addNotes(slide.speakerNotes);
    }
  });

  const fileName = `${deck.companyName.toLowerCase().replace(/\s+/g, "_")}_pitch_deck.pptx`;
  await pptx.writeFile({ fileName });
}
