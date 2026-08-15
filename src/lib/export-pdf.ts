import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportSlideElementToPDF(
  slideElementIds: string[],
  deckTitle: string
): Promise<void> {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1920, 1080],
  });

  for (let i = 0; i < slideElementIds.length; i++) {
    const elId = slideElementIds[i];
    const element = document.getElementById(elId);
    if (!element) continue;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/png");
    if (i > 0) {
      pdf.addPage([1920, 1080], "landscape");
    }
    pdf.addImage(imgData, "PNG", 0, 0, 1920, 1080);
  }

  const fileName = `${deckTitle.toLowerCase().replace(/\s+/g, "_")}.pdf`;
  pdf.save(fileName);
}
