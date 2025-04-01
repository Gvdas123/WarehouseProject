import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  async generatePdf(htmlElement: HTMLElement, fileName: string = 'document') {
    const doc = new jsPDF('p', 'mm', 'a4');
    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true
    };

    const canvas = await html2canvas(htmlElement, options);
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = doc.internal.pageSize.getWidth() - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    doc.save(`${fileName}_${new Date().toISOString()}.pdf`);
  }
}