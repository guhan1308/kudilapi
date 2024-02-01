var fs = require("fs");
const { jsPDF } = require("jspdf");
const imgData = fs.readFileSync(__dirname + "/assets/logo2.png");
const window = fs.readFileSync(__dirname + "/assets/images/img1.jpg");

// const pricing = fs.readFileSync(__dirname + "/pricing.json");

require('jspdf-autotable');
require('./assets/rock');
require('./assets/ROCK-bold');






exports.pdfcreate = async (newQuotation) => {
    try {

        const doc = new jsPDF();
        doc.setFont('ROCK');
        const docWidth = doc.internal.pageSize.width;
        const docHeight = doc.internal.pageSize.height;
        let quotationData = await jsonupdate(newQuotation);
        let filepath = await generatePdf(quotationData, doc, docWidth, docHeight);
        return filepath;
    } catch (error) {
        throw error;
    }
};



function generatePdf(quotationData, doc, docWidth, docHeight) {
    const pricing = [
        {
            "category": "Window",
            "types": [
                {
                    "type": "Velcro Fit",
                    "notes": false,
                    "meshes": [
                        {
                            "name": "Fibreglass Mesh",
                            "image": "img1.jpg",
                            "price": 45
                        },
                        {
                            "name": "VELCR0 FIT (Elite Fibreglass)",
                            "image": "img2.jpg",
                            "price": 60
                        },
                        {
                            "name": "VELCR0 FIT (Tuff Screen)",
                            "image": "img3.jpg",
                            "price": 150
                        },
                        {
                            "name": "VELCR0 FIT (Pet Screen)",
                            "image": "img4.jpg",
                            "price": 167
                        }
                    ]
                },
                {
                    "type": "Classic Window Fit",
                    "meshes": [
                        {
                            "name": "SSvue",
                            "image": "img1.jpg",
                            "price": 240
                        },
                        {
                            "name": "CLASSIC WINDOW FIT (Fibreglass)",
                            "image": "img2.jpg",
                            "price": 170
                        },
                        {
                            "name": "CLASSIC WINDOW FIT (Aluminium)",
                            "image": "img3.jpg",
                            "price": 200
                        },
                        {
                            "name": "CWF (Stainless steel) ",
                            "image": "img4.jpg",
                            "price": 270
                        }
                    ]
                },
                {
                    "type": "Glossy Roll Fit - Inner",
                    "meshes": [
                        {
                            "name": "Elite Fibreglass Mesh",
                            "image": "img1.jpg",
                            "price": 350
                        },
                        {
                            "name": "GLOSSY ROLL FIT - OUTER (Elite Fibreglass Mesh)",
                            "image": "img1.jpg",
                            "price": 380
                        }
                    ]
                },
                {
                    "type": "Crease Fit Ditto - Single",
                    "meshes": [
                        {
                            "name": "Waterproof Mesh",
                            "image": "img1.jpg",
                            "price": 410
                        },
                        {
                            "name": "CREASE FIT DITTO - DOUBLE (Waterproof Mesh)",
                            "image": "img1.jpg",
                            "price": 450
                        }
                    ]
                },
                {
                    "type": "Trim Glide Fit (Sliding)",
                    "notes": false,
                    "meshes": [
                        {
                            "name": "SSvue",
                            "image": "img1.jpg",
                            "price": 670
                        },
                        {
                            "name": "TRIM GLIDE FIT (Fiberglass Mesh)",
                            "image": "img1.jpg",
                            "price": 625
                        },
                        {
                            "name": "TRIM GLIDE FIT (Elite Fibreglass)",
                            "image": "img1.jpg",
                            "price": 635
                        },
                        {
                            "name": "TRIM GLIDE FIT (Aluminium Mesh)",
                            "image": "img1.jpg",
                            "price": 667
                        },
                        /*  {
                             "name": "SS Mesh",
                             "image": "img1.jpg",
                             "price": 870
                         },
                         {
                             "name": "BRONZE Mesh",
                             "image": "img1.jpg",
                             "price": 992
                         },
     
                         {
                             "name": "Solar Screen",
                             "image": "img1.jpg",
                             "price": 785
                         },
                         {
                             "name": "Pet Screen",
                             "image": "img1.jpg",
                             "price": 745
                         } */
                    ]
                }
            ]
        }
    ];


    try {
        const styles = {
            font: 'ROCK',
            cellPadding: 2,
            fontSize: 10,
            minCellHeight: 10,
            valign: 'middle',

        };
        const headerStyles = {
            // fillColor: [8, 106, 216],
            fillColor: [148, 148, 153],
            halign: 'center',
            lineWidth: 0.1,
            lineColor: [155, 155, 155],

        };
        const columns = [['Room', 'Size (wxh)', 'Qty', 'Total Sq.', 'Rate sq.ft', 'Total']];
        // 'Frame Type',
        const columnStyles = {
            0: { halign: 'center' },
            1: { cellWidth: 25, halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: {  halign: 'center' },
            5: { cellWidth: 25, halign: 'right' },

        };

        let currentPricing = pricing.find(x => x.category == quotationData.areatype);

        currentPricing.types.forEach((itemtypes, ind) => {

            let totalSqft = 0;
            let totalPrice = 0;
            let sizes = quotationData.size.map(item => {

                const { width, height, quantity, room } = item;
                const totalSqf = (width * height) * quantity;
                let totalSq = totalSqf;
                if(quotationData.uom == 'mm'){
                    totalSq = totalSq / 645.16 / 144;
                }
                if(quotationData.uom == 'cm'){
                    totalSq = totalSq / 6.4516 / 144;
                }
                if(quotationData.uom == 'in'){
                    totalSq = totalSq / 144;
                }
                totalSq = Math.round(totalSq)
                const rateSqFt = itemtypes.meshes[0].price;
                const price = rateSqFt * totalSq;
                totalSqft += totalSq;
                totalPrice += price;
                return [room, `${width} x ${height}${quotationData.uom}`, quantity, `${totalSq}`, rateSqFt.toLocaleString('en-IN'), price.toLocaleString('en-IN')];
                // `${itemtypes.type} (${itemtypes.meshes[0].name}) `,
            });
            sizes.push(
                // [{ content: 'SUBTOTAL', colSpan: 5, styles: { halign: 'right' } }, totalPrice.toLocaleString('en-IN')],
                [{ content: '', colSpan: 3 }, { content: totalSqft, styles: { fontStyle: 'bold' } }, { content: 'TOTAL', styles: { halign: 'right' } },
                { content: totalPrice.toLocaleString('en-IN'), styles: { fontStyle: 'bold' } },]
            );

            // doc.setTextColor(147, 149, 152);
            var tlttext = `${ind + 1}. ${itemtypes.type.toUpperCase()}`;
            var titletextWidth = doc.getTextWidth(tlttext);
            var titlecenterX = (doc.internal.pageSize.getWidth() - titletextWidth) / 2;
            doc.text(tlttext, titlecenterX, 87);
            doc.line(titlecenterX - 5, 90, titlecenterX + 5 + titletextWidth, 90)
            doc.autoTable({
                theme: 'grid',
                head: columns,
                body: sizes,
                margin: { top: 95, bottom: 110, left: 78, },
                styles: styles,
                headStyles: headerStyles,
                columnStyles: columnStyles,
                didDrawPage: function (data) {
                    addHeader(quotationData, doc, docWidth, docHeight);

                    const styles = {
                        fontSize: 12,
                        // font: 'helvetica',
                    };
                    // 086ad8
                    const headerStylestwo = {
                        fillColor: '#f9ab2a',
                        textColor: '#fff',
                    };
                    // (147, 149, 152)
                    doc.setFillColor(248, 182, 13);
                    doc.setTextColor(headerStylestwo.textColor);
                    doc.rect(13, 95, 60, 10, 'F');
                    // doc.rect(13, 95, 60, 10, 'F'); 
                    doc.text(`${itemtypes.meshes[0].name}`, 43, 101, { align: 'center' });
                    // doc.text(`(${itemtypes.meshes[0].name})`, 43, 97, { align: 'center' });
                    // doc.rect(13, 100, 60, 50, 'F'); 
                    doc.setLineWidth(0.1);
                    doc.addImage(window, 'JPG', 18, 110, 40, 40);
                    doc.setDrawColor(199, 199, 199);
                    doc.rect(13, 105, 60, 50);
                    doc.setFont(styles.font);
                    doc.setFontSize(styles.fontSize);
                    let blmeshes = [...itemtypes.meshes]
                    addFooter(itemtypes.notes, blmeshes.splice(1, itemtypes.meshes.length), totalSqft, doc, docWidth, docHeight, quotationData);


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
        // doc.deletePage(pageCount)
        doc.setDrawColor(155, 155, 155);
        doc.rect(
            13,
            13,
            184,
            268
        );

        doc.autoTable({
            theme: 'plain',
            head: [['TERMS AND CONDITIONS']],
            body: [
                ['1. An Intellectual Property clause will inform users that the contents, logo and other visual media you created is your property and is protected by copyright laws.'],
                ['2. A Termination clause will inform users that any accounts on your website and mobile app, or users access to your website and app, can be terminated in case of abuses or at your sole discretion. '],
                ['3. A Governing Law clause will inform users which laws govern the agreement. These laws should come from the country in which your company is headquartered or the country from which you operate your website and mobile app. '],
                ['4. A Links to Other Websites clause will inform users that you are not responsible for any third party websites that you link to. This kind of clause will generally inform users that they are responsible for reading and agreeing (or disagreeing) with the Terms and Conditions or Privacy Policies of these third parties.                '],
            ],
            styles: {
                head: {
                    fontStyle: 'bold',
                    halign: 'center',
                },
            },
            startY: 16,
        });
        const pagenoCount = doc.internal.getNumberOfPages()
        doc.setFontSize(10)
        for (var i = 1; i <= pagenoCount; i++) {
            doc.setPage(i);
            doc.setTextColor(100, 100, 100);
            doc.text('Page ' + String(i) + ' of ' + String(pagenoCount), doc.internal.pageSize.width / 2, 287, {
                align: 'center'
            })
        }

        // /${quotationData.invoiceno}
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
        const invoiceno = `KA${String(currentId + 1).padStart(4, '0')}`;
        const updatedQuotation = { id: currentId + 1, invoiceno: invoiceno, ...newQuotation, };
        database.push(updatedQuotation);
        const updatedJsonData = JSON.stringify(database, null, 2);
        fs.writeFileSync('data.json', updatedJsonData);
        return updatedQuotation;

    } catch (error) {
        return error;
    }
}



function addHeader(quotationData, doc, docWidth, docHeight) {
    try {
        doc.setTextColor(0, 0, 0);
        doc.setFont('ROCK');
        let headerStart = 20;
        doc.addImage(imgData, 'png', docWidth - 68, 15, 60, 23,);
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



function addFooter(notes, meshes, totalSqft, doc, docWidth, docHeight, quotationData) {
    try {
        doc.setFont('ROCK');
        doc.setFontSize(12);
        doc.setFillColor(147, 149, 152);
        doc.rect(0, docHeight - 115, 63, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Other Option Models', 13, docHeight - 110);
        if (notes) {
            console.log('notes', notes);
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            doc.text('* More Options Available', 13, docHeight - 20);
        }
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
        let newPageAdded = false;
        console.log('meshes', meshes);

        for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i];
            if (i < 3) {
                let margin = 13;
                if (i === 0) margin = 13;
                if (i === 1) margin = 78;
                if (i === 2) margin = 143;
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
                        }, { content: `${tot.toLocaleString('en-IN')}`, styles: { halign: 'center', fontStyle: 'bold' } }],
                    ],
                    startY: docHeight - 100,
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
            else {
                if (!newPageAdded) {
                    doc.addPage();
                    addHeader(quotationData, doc, docWidth, docHeight);
                    let balanceMeshes = meshes.splice(3, meshes.length)
                    addOtherOption(balanceMeshes, totalSqft, doc, docWidth, docHeight, quotationData);
                    newPageAdded = true;
                }
            }
        }
    } catch (error) {
        return error;
    }


}
function addOtherOption(meshes, totalSqft, doc, docWidth, docHeight, quotationData) {
    try {
        doc.setFont('ROCK');
        doc.setFontSize(12);
        doc.setFillColor(147, 149, 152);
        doc.rect(0, 85, 63, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Other Option Models', 13, 90);

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
            let margin = 13;
            if (i === 0) margin = 13;
            if (i === 1) margin = 78;
            if (i === 2) margin = 143;
            if (i === 3) margin = 13;
            if (i === 4) margin = 78;
            if (i === 5) margin = 143;
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
                    }, { content: `${tot.toLocaleString('en-IN')}`, styles: { halign: 'center', fontStyle: 'bold' } }],
                ],
                startY: i > 2 ? 180 : 100,
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
    } catch (error) {
        return error;
    }


}


