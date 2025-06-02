import { createObjectCsvWriter } from "csv-writer";
import ExcelJS from "exceljs";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";


const data = [
  { id: 1, name: "Alice", score: 95 },
  { id: 2, name: "Bob", score: 85 },
  { id: 3, name: "Charlie", score: 78 },
];


export const exportPdf = (req: Request, res: Response) => {
  const doc = new PDFDocument({ margin: 30 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=data.pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Score Table", { align: "center" });
  doc.moveDown();


  doc.fontSize(12).text("ID", 50).text("Name", 150).text("Score", 300);
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(500, doc.y).stroke();

  // Table rows
  data.forEach((row) => {
    doc
      .text(row.id.toString(), 50)
      .text(row.name, 150)
      .text(row.score.toString(), 300);
    doc.moveDown();
  });

  doc.end();
};

// 📄 Generate and download CSV
export const exportCsv = async (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "data.csv");

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: "id", title: "ID" },
      { id: "name", title: "Name" },
      { id: "score", title: "Score" },
    ],
  });

  await csvWriter.writeRecords(data);
  res.download(filePath, "data.csv", (err) => {
    if (!err) fs.unlinkSync(filePath); // Delete after sending
  });
};

// 📊 Generate and download Excel
export const exportExcel = async (req: Request, res: Response) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Scores");

  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Name", key: "name", width: 30 },
    { header: "Score", key: "score", width: 10 },
  ];

  sheet.addRows(data);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");

  await workbook.xlsx.write(res);
  res.end();
};
