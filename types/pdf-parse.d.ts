declare module 'pdf-parse' {
  interface PDFData { text: string; numpages: number; info: any }
  function pdfParse(dataBuffer: Buffer, options?: any): Promise<PDFData>
  export = pdfParse
}
