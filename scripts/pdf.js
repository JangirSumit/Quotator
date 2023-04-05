document.getElementById("generate-pdf")
    .addEventListener("click", function (event) {
        const doc = new jspdf.jsPDF();

        doc.text("Hello world!", 10, 10);
        doc.save("a4.pdf");
});