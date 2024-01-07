var fs = require("fs");
const { jsPDF } = require("jspdf");
const imgData = fs.readFileSync(__dirname + "/assets/logo.png");
// const pricingjsonData = fs.readFileSync('./pricing.json');
const pricing = [
    {
        "category": "Window",
        "types": [
            {
                "type": "Velcro Fit",
                "meshes": [
                    {
                        "name": "Fiberglass Mesh",
                        "image": "img1.jpg",
                        "price": 50
                    },
                    {
                        "name": "Elite Fibreglass",
                        "image": "img2.jpg",
                        "price": 20
                    },
                    {
                        "name": "Premium Fibreglass",
                        "image": "img3.jpg",
                        "price": 30
                    },
                    {
                        "name": "Excel Fibreglass",
                        "image": "img4.jpg",
                        "price": 40
                    }
                ]
            },
            {
                "type": "Silro Fit",
                "meshes": [
                    {
                        "name": "Sm Mesh",
                        "image": "img1.jpg",
                        "price": 50
                    },
                    {
                        "name": "Md Fibreglass",
                        "image": "img2.jpg",
                        "price": 20
                    },
                    {
                        "name": "LG Fibreglass",
                        "image": "img3.jpg",
                        "price": 50
                    },
                    {
                        "name": "XL Fibreglass",
                        "image": "img4.jpg",
                        "price": 30
                    }
                ]
            }
        ]
    }
];

require('jspdf-autotable');
require('./assets/rock');


const doc = new jsPDF();
doc.setFont('ROCK');
const docWidth = doc.internal.pageSize.width;
const docHeight = doc.internal.pageSize.height;



exports.pdfcreate = async (newQuotation) => {
    try {
        let quotationData = await jsonupdate(newQuotation);
        let filepath = await generatePdf(quotationData);
        console.log('filepath', filepath)
        return filepath;
    } catch (error) {
        throw error;
    }
};


function generatePdf(quotationData) {




    try {
        const styles = {
            font: 'ROCK',
            cellPadding: 2,
            fontSize: 12,
            minCellHeight: 10,
            valign: 'middle',

        };
        const headerStyles = {
            fillColor: [8, 106, 216],
            halign: 'center'
        };
        const columns = [['Frame Type', 'Size (w x h)', 'Qty', 'Total Sq.', 'Rate sq.ft', 'Total']];

        const columnStyles = {
            0: { halign: 'center' },
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { cellWidth: 25, halign: 'center' },
            5: { cellWidth: 25, halign: 'right' },

        };

        let currentPricing = pricing.find(x => x.category == quotationData.areatype);

        currentPricing.types.forEach(itemtypes => {
            let totalSqft = 0;
            let totalPrice = 0;
            let sizes = quotationData.size.map(item => {
                const { width, height, quantity } = item;
                const totalSq = (width * height) * quantity;
                const rateSqFt = itemtypes.meshes[0].price;
                const price = rateSqFt * totalSq;
                totalSqft += totalSq;
                totalPrice += price;
                return [`${itemtypes.type} (${itemtypes.meshes[0].name}) `, `${width} X ${height}`, quantity, `${totalSq}`, rateSqFt.toLocaleString('en-IN'), price.toLocaleString('en-IN')];
            });
            sizes.push(
                // [{ content: 'SUBTOTAL', colSpan: 5, styles: { halign: 'right' } }, totalPrice.toLocaleString('en-IN')],
                [{ content: 'TOTAL', colSpan: 5, styles: { halign: 'right' } }, totalPrice.toLocaleString('en-IN')]
            );

            doc.autoTable({
                theme: 'grid',
                head: columns,
                body: sizes,
                margin: { top: 85, bottom: 120, },
                styles: styles,
                headStyles: headerStyles,
                columnStyles: columnStyles,
                didDrawPage: function (data) {
                    addHeader(quotationData);
                    addFooter(itemtypes.meshes, totalSqft);
                },
                /*   didDrawCell: function (data) {
                      if (data.row.index === 0 && data.column.index === 0) {
                          doc.addImage(imgData, 'PNG', data.cell.x + 5, data.cell.y + 10, 50, 50);
                      }
                  }, */
            });
            doc.addPage()
        })

        var pageCount = doc.internal.getNumberOfPages();
        doc.deletePage(pageCount)
        doc.save(`./pdfs/${quotationData.invoiceno}.pdf`);
        return quotationData;
    } catch (error) {
        return error;
    }
}

function jsonupdate(newQuotation) {

    try {
        const jsonData = fs.readFileSync('data.json');
        const database = JSON.parse(jsonData) || [];
        const lastEntry = database[database.length - 1];
        const currentId = lastEntry ? lastEntry.id : 0;
        console.log('updatedJsonData' , currentId)
        const invoiceno = `KA${String(currentId + 1).padStart(4, '0')}`;
        const updatedQuotation = { id: currentId + 1, invoiceno: invoiceno, ...newQuotation, };
        database.push(updatedQuotation);
        const updatedJsonData = JSON.stringify(database, null, 2);
        fs.writeFileSync('data.json', updatedJsonData);
        console.log('updatedJsonData' , updatedJsonData)
        return updatedQuotation;

    } catch (error) {
        return error;
    }
}



function addHeader(quotationData) {
    try {
        let headerStart = 20;
        doc.addImage(imgData, 'png', docWidth - 63, 15, 50, 12,);
        doc.setFontSize(14);
        doc.text('Kudilagam Interiors', 13, headerStart);
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        const address = [
            '14, DD Main Rd, opp. Agarwal Eye Hospital,',
            '1st street, Arappalayam, Madurai-625016',
            'Cell: 77089 66134 Email: info@kudilagam.com',
            'www.kudilagam.com | GST UUHSIOIO5788',
        ]
        address.forEach(text => {
            headerStart += 5
            doc.text(text, 13, headerStart);
        })

        doc.line(13, 45, doc.internal.pageSize.width - 13, 45);
        let textStart = 52;
        let addressStart = 60;
        doc.setFontSize(12);
        doc.text('Quotation issued for:', 13, textStart,);
        doc.setTextColor(0, 0, 0);
        doc.text(`Mr./Ms. ${quotationData.name.toUpperCase()},`, 13, textStart + 7,);
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        const customeraddress = [
            `City: ${quotationData.city}`,
            `Mob: ${quotationData.mobile}`,
            `Mail: ${quotationData.email}`,
        ]
        customeraddress.forEach(text => {
            addressStart += 5
            doc.text(text, 13, addressStart);
        })
        doc.setFontSize(12);
        const currentDate = new Date();
        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 30);
        const formattedDate = formatDate(currentDate);
        const formattedFutureDate = formatDate(futureDate);
        doc.text(`Invoice Number : ${quotationData.invoiceno}`, docWidth - 13, textStart + 7, { align: 'right', });
        doc.text(`Invoice Date : ${formattedDate}`, docWidth - 13, textStart + 14, { align: 'right', });
        doc.text(`Valid Till : ${formattedFutureDate}`, docWidth - 13, textStart + 21, { align: 'right', });
    } catch (error) {
        throw error;
    }


}


function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}



function addFooter(meshes, totalSqft) {
    try {
        doc.setFontSize(12);
        doc.setFillColor(255, 255, 255);
        doc.rect(0, docHeight - 105, docWidth, docHeight, 'F');
        doc.setFillColor(147, 149, 152);
        doc.rect(0, docHeight - 105, 63, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Other Option Models', 13, docHeight - 100);

        const styles = {
            font: 'ROCK',
            cellPadding: 2,
            fontSize: 9,
            valign: 'middle',
        };

        const headerStyles = {
            fillColor: [8, 106, 216],
        };

        const columnStyles = {
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'center' },
        };
        for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i];
            if (i > 0) {
                let margin = 13;
                if (i === 1) margin = 13;
                if (i === 2) margin = 78;
                if (i === 3) margin = 143;
                const cdimage = fs.readFileSync(__dirname + `/assets/images/${mesh.image}`);
                const tot = mesh.price * totalSqft;

                doc.autoTable({
                    theme: 'grid',
                    body: [
                        [{ content: mesh.name, colSpan: 3, styles: { halign: 'center' } }],
                        [{ content: '', colSpan: 3, styles: { minCellHeight: 50 } }],
                        [{ content: 'Total Sq.', styles: { halign: 'center' } },
                        { content: 'Rate sq.ft', styles: { halign: 'center' } },
                        { content: 'Total', styles: { halign: 'center' } }],
                        [{ content: totalSqft, styles: { halign: 'center' } }, {
                            content: `${mesh.price.toLocaleString('en-IN')}`,
                            styles: { halign: 'center' }
                        }, { content: `${tot.toLocaleString('en-IN')}`, styles: { halign: 'center' } }],
                    ],
                    startY: docHeight - 90,
                    styles: styles,
                    headStyles: headerStyles,
                    columnStyles: columnStyles,
                    tableWidth: 60,
                    margin: { left: margin },
                    didParseCell: function (data) {
                        if (data.row.index === 0 || data.row.index === 2) {
                            data.cell.styles.fillColor = '#086ad8';
                            data.cell.styles.textColor = '#fff';
                        }
                    },

                    didDrawCell: function (data) {
                        if (data.row.index === 1 && data.column.index === 0) {
                            doc.addImage(cdimage, 'JPG', data.cell.x + 5, data.cell.y + 5, 40, 40);
                        }

                    },
                });
            }
        }
    } catch (error) {
        return error;
    }


}
