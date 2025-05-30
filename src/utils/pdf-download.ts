import { EnrollmentType } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const pdfDownload = (docName: string, data: EnrollmentType[]) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`${docName} - Applicants List`, 14, 15);
  doc.setFontSize(12);

  const tableData = data.map(
    ({ level, course, surname, otherNames, email, state, createdAt }) => [
      `${surname} ${otherNames}\n${email}`,
      state,
      course,
      level,
      status,
      new Date(createdAt).toDateString(),
    ]
  );

  autoTable(doc, {
    head: [["Applicants", "Location", "Course", "Level", "Status", "Date"]],
    body: tableData,
    startY: 25,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [33, 33, 33],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 35 },
      5: { cellWidth: 25 },
    },
  });

  doc.save(`${docName}-applicants.pdf`);
};
