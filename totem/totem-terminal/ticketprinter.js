const { PosPrinter } = require("electron-pos-printer");
const admin = require('./admin');
const util = require('./util');

let options


function init() {
    options = {
        preview: false,
        width: '250px',
        //height: '1000px',        
        margin: '0 0 0 0',
        copies: 1,
        printerName: admin.getTerminal().printerTicketName,
        timeOutPerLine: 400,
        pageSize: '80mm',
        silent: true,
    }
}

function status() {
    let rtn = "";
    if (admin.getTerminal().printTicket && admin.getTerminal().printerTicketName != null && admin.getTerminal().printerTicketName != "") {

        const foundPrinter = admin.getPrinters().find((printer) => printer.name === admin.getTerminal().printerTicketName);

        if (foundPrinter) {
            /*
                0: Desconocido o no disponible.
                1: Inactivo.
                2: Activo.
                3: En pausa.
                4: Atascado o con un problema.
                5: Sin papel.
                6: Sin tóner o tinta.
                7: Sin papel ni tóner.
                8: En proceso de impresión.
            */
            rtn = "online";

        }
        else {
            rtn = "offline";

        }
    }
    else {
        rtn = "online";

    }
    return rtn;

}

function generateData(tran, cashData, test) {

if (test)
{
    options = {
        preview: false,
        width: '220px',
        //height: '1000px',        
        margin: '0 0 0 0',
        copies: 1,
        printerName: admin.getTerminal().printerTicketName,
        timeOutPerLine: 400,
        pageSize: '80mm',
        silent: true,
    }
}
else
{
    options = {
        preview: false,
        width: '250px',
        //height: '1000px',        
        margin: '0 0 0 0',
        copies: 1,
        printerName: admin.getTerminal().printerTicketName,
        timeOutPerLine: 400,
        pageSize: '80mm',
        silent: true,
    }
}

    let vouchererror = ""
    let voucher = ""
    let voucherValue = ""
    let mpfee = "";
    let mpfeevalue = "";
    let orderPay = ""
    let status = "CANCELADA";
    if (test)
        status = "PRUEBA";
    else if (tran.status == 2)
        status = "PAGADA";

    if (tran.status == 2) {
        if (cashData.Code == 0) {
            voucher = "CUPON";
            Value = util.generateNumberValidation(cashData.ValidationId);
        }
        else {
            vouchererror = cashData.Message
        }
    }


    if (tran.status == 2) {
        if (tran.feeBorneClientCharge) {
            mpfee = 'Impuesto MP  (A cargo del cliente)'
            mpfeevalue = '$' + parseFloat(tran.mpFee,).toFixed(2);
        }
        if (tran.mpCode)
            orderPay = 'Orden de pago: ' + tran.mpCode
    }




    const data = [
        {
            type: 'text',
            value: admin.setBranchName(tran, cashData),
            style: { fontWeight: "900", textAlign: 'center', fontSize: "16px" }
        },


        {
            type: 'text',
            value: admin.getConfigGeneral().branchAddress ?? '-',
            style: { fontWeight: "700", textAlign: 'center', fontSize: "12px" }
        },

        {
            type: 'table',
            style: { border: '0px solid #ddd', fontFamily: 'verdana' },
            tableHeader: ['', ''],
            tableBody: [
                [

                    {
                        type: 'text',
                        value: 'Fecha y Hora',
                        style: { fontSize: "7px", textAlign: "left" }
                    },
                    {
                        type: 'text',
                        value: formatDateTime(tran.stamp),
                        style: { fontSize: "8px", textAlign: "right" }
                    }
                ],
                [
                    {
                        type: 'text',
                        value: 'Terminal',
                        style: { fontSize: "7px", textAlign: "left" }
                    },
                    {
                        type: 'text',
                        value: admin.getTerminal().terminalName,
                        style: { fontSize: "8px", textAlign: "right" }
                    },

                ],

                [
                    {
                        type: 'text',
                        value: voucher,
                        style: { fontSize: "7px", textAlign: "left" }
                    },
                    {
                        type: 'text',
                        value: voucherValue,
                        style: { fontSize: "8px", textAlign: "right" }

                    },

                ],



            ],
            tableFooter: ['', ''],
            tableHeaderStyle: { backgroundColor: '#000', color: 'white' },
            tableBodyStyle: { border: '0.5px solid #ddd' },
            tableFooterStyle: { backgroundColor: '#000', color: 'white' },
        },


        {
            type: 'table',
            style: { border: '2px solid #ddd', fontFamily: 'verdana' },
            tableHeader: ['', ''],
            tableBody: [
                [

                    {
                        type: 'text',
                        value: 'IMPORTE',
                        style: { fontSize: "12px", fontWeight: "700", textAlign: "left" }
                    },
                    {
                        type: 'text',
                        value: '$' + parseFloat(tran.total,).toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }),
                        style: { fontSize: "16px", fontWeight: "700", textAlign: "right" }
                    }
                ],
                [
                    {
                        type: 'text',
                        value: 'Impuesto (Ley 27.346) (' + parseFloat(tran.taxPercentage,).toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }) + '%)',
                        style: { fontSize: "8px", fontWeight: "700", textAlign: "left" }
                    },
                    {
                        type: 'text',
                        value: '$' + parseFloat(tran.tax,).toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }),
                        style: { fontSize: "16px", fontWeight: "700", textAlign: "right" }
                    },

                ],
                [
                    {
                        type: 'text',
                        value: mpfee,
                        style: { fontSize: "8px", fontWeight: "700", textAlign: "left" }
                    },
                    {
                        type: 'text',
                        value: mpfeevalue,
                        style: { fontSize: "16px", fontWeight: "700", textAlign: "right" }
                    },

                ],
                [
                    {
                        type: 'text',
                        value: 'TOTAL',
                        style: { fontSize: "12px", fontWeight: "700", textAlign: "left" }
                    },
                    {
                        type: 'text',
                        value: '$' + parseFloat(tran.amount,).toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }),
                        style: { fontSize: "16px", fontWeight: "700", textAlign: "right" }
                    },

                ],


            ],

            tableFooter: ['', ''],

            tableHeaderStyle: { backgroundColor: '#000', color: 'white' },

            tableBodyStyle: { border: '2px solid #ddd' },

            tableFooterStyle: { backgroundColor: '#000', color: 'white' },
        },

        {
            type: 'barCode',
            value: tran.transactionId,
            height: 40,
            width: 1,
            displayValue: false,
        },
        {
            type: 'text',
            value: tran.transactionId,
            style: { fontSize: "8px", textAlign: "center" }
        },
        {
            type: 'text',
            value: orderPay,
            style: { fontSize: "12px", textAlign: "center" }
        },
        {
            type: 'text',
            value: "--------------------------------",
            style: { fontWeight: "700", fontSize: "16px", textAlign: "center" }
        },


        {
            type: 'text',
            value: status,
            style: { fontWeight: "700", fontSize: "16px", textAlign: "center" }
        },


        {
            type: 'text',
            value: vouchererror,
            style: { fontWeight: "700", fontSize: "16px", textAlign: "center" }
        },
        {
            type: 'text',
            value: "--------------------------------",
            style: { fontWeight: "700", fontSize: "16px", textAlign: "center" }
        },


        {
            type: 'text',
            value: 'Totem',
            style: { fontSize: "12px", textAlign: "center" }
        },
    ]

    return data;

}

function formatDateTime(dateTimeString) {
    const dateObject = new Date(dateTimeString);

    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Sumamos 1 porque los meses en JavaScript son base 0
    const year = dateObject.getFullYear();

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

    return `${formattedDate} ${formattedTime}`;
}
function printTicket(data) {
    PosPrinter.print(data, options)
        .then(() => console.log('done'))
        .catch((error) => {

            console.error(error);

        });
}

module.exports = {
    init,
    status,
    generateData,
    printTicket
};