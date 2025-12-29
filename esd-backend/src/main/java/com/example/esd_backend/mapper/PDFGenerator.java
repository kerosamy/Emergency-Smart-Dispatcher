package com.example.esd_backend.mapper;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

public class PDFGenerator {
    public static ByteArrayInputStream generateStatisticsPDF(String title,
                                             List<Object[]> stats,
                                             List<Object[]> topVehicles,
                                             List<Object[]> topStations,
                                            ArrayList<String> headersVehicles,
                                            ArrayList<String> headersStations) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try{
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            
            document.open();
            
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph line = new Paragraph(title, titleFont);
            line.setAlignment(Element.ALIGN_CENTER);
            line.setSpacingAfter(20);
            document.add(line);

            PdfPTable statsTable = new PdfPTable(3);

            statsTable.setWidthPercentage(100);
            statsTable.setSpacingBefore(10f);
            statsTable.setSpacingAfter(10f);

            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            PdfPCell header1 = new PdfPCell(new Paragraph("Minimum Response Time", headerFont));
            PdfPCell header2 = new PdfPCell(new Paragraph("Maximum Response Time", headerFont));
            PdfPCell header3 = new PdfPCell(new Paragraph("Average Response Time", headerFont));
            header1.setBackgroundColor(BaseColor.DARK_GRAY);
            header2.setBackgroundColor(BaseColor.DARK_GRAY);
            header3.setBackgroundColor(BaseColor.DARK_GRAY);
            statsTable.addCell(header1);
            statsTable.addCell(header2);
            statsTable.addCell(header3);

            for(Object[] row : stats) {
                statsTable.addCell(row[0] != null ? row[0].toString() : "N/A");
                statsTable.addCell(row[1] != null ? row[1].toString() : "N/A");
                statsTable.addCell(row[2] != null ? row[2].toString() : "N/A");
            }
            document.add(statsTable);

            if (topVehicles != null && !topVehicles.isEmpty()) {
                PdfPTable vehicleTable = new PdfPTable(topVehicles.get(0).length);
                vehicleTable.setWidthPercentage(100);
                vehicleTable.setSpacingBefore(10f);
                vehicleTable.setSpacingAfter(10f);
                Font vehicleHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
                for(Object headerData : headersVehicles) {
                    PdfPCell headerCell = new PdfPCell(new Paragraph(headerData.toString(), vehicleHeaderFont));
                    headerCell.setBackgroundColor(BaseColor.DARK_GRAY);
                    vehicleTable.addCell(headerCell);
                } 
                for(Object[] row : topVehicles) {
                    for(Object cellData : row) {
                        vehicleTable.addCell(cellData != null ? cellData.toString() : "N/A");
                    }
                }
                document.add(vehicleTable);
            }

            if (topStations != null && !topStations.isEmpty()) {
                PdfPTable stationTable = new PdfPTable(topStations.get(0).length);
                stationTable.setWidthPercentage(100);
                stationTable.setSpacingBefore(10f);
                stationTable.setSpacingAfter(10f);
                Font stationHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
                for(Object headerData : headersStations) {
                    PdfPCell headerCell = new PdfPCell(new Paragraph(headerData.toString(), stationHeaderFont));
                    headerCell.setBackgroundColor(BaseColor.DARK_GRAY);
                    stationTable.addCell(headerCell);
                } 
                for(Object[] row : topStations) {
                    for(Object cellData : row) {
                        stationTable.addCell(cellData != null ? cellData.toString() : "N/A");
                    }
                }
                document.add(stationTable);
            }

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}