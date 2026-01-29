import jsPDF from "jspdf";

const generateReceiptPDF = (transaction) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("PayGo Transaction Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Reference: ${transaction.reference}`, 20, 40);
    doc.text(`Amount: ₦${transaction.amount}`, 20, 50);
    doc.text(`Recipient: ${transaction.recipientEmail}`, 20, 60);
    doc.text(`Status: ${transaction.status}`, 20, 70);
    doc.text(
        `Date: ${new Date(transaction.createdAt).toLocaleString()}`,
        20,
        80
    );

    doc.save(`receipt-${transaction.reference}.pdf`);
};

export default generateReceiptPDF;
