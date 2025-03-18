const util = require('./util');
const admin = require('./admin');
const titoPrinter = require('./titoprinter');
const ticketPrinter = require('./ticketprinter');

let urlApi;
let termId;

const TransactionStatus = {
    New: 0,
    InProcess: 1,
    Finished: 2,
    Error: 3,
    Cancel: 4,
    CancelPayment: 5,
    CancelCashierError: 6,
    FinishTITOError: 7
};


const TransactionStep = {
    New: { value: 0, description: 'Nueva transacción' },
    SendToCashier: { value: 1, description: 'Enviar la transacción al cajero' },
    ReceiveFromCashier: { value: 2, description: 'Recibir la transacción del cajero' },
    SendToMP: { value: 3, description: 'Enviar la transacción a MercadoPago' },
    ReceiveFromMP: { value: 4, description: 'Recibir la transacción de MercadoPago' },
    ReceivePayment: { value: 5, description: 'Recibir el pago' },
    CancelPayment: { value: 6, description: 'Cancelar el pago' },
    PrintTITO: { value: 7, description: 'Imprimir el ticket TITO' },
    PrintTicket: { value: 8, description: 'Imprimir el ticket' },
    OrderErrorFromMP: { value: 9, description: 'Recibir un error de orden de MercadoPago' },
    ReceiveMerchantOrder: { value: 10, description: 'Recibir la orden del comerciante' },
    ReceiveMPError: { value: 11, description: 'Recibir un error de MercadoPago' },
    PrintTITOError: { value: 12, description: 'Error al Imprimir el ticket TITO' },
    ReceiveCashierError: { value: 13, description: 'Error al recibir información del cajero' },
    RePrintTITO: { value: 14, description: 'Reimpresion de TITO' },
    RePrintTicket: { value: 15, description: 'Reimpresion de ticket' },
};


function init() {
    urlApi = admin.getConfig().api.url;
    termId = admin.getConfig().terminalId;
}


async function handlegenerateTran(event, options) {
    let rtn = {};
    try {

        let op = generateTransaction(options);
        const tran = await util.sendData(op);
        generateTranLog(tran.transactionId, TransactionStep.New, JSON.stringify(await util.generateDataLog("", op)))
        rtn = {
            data: tran
        };
    }
    catch (error) {
        console.error(error);
        rtn = {
            info: "Error en comunicación con el sistema central.",
            error: error.name,
            message: error.message
        };
    }

    return rtn;
}

async function handlegenerateQR(event, options) {
    let rtn = {};
    let code
    try {
        const QRCode = require('qrcode');
        let status = 0;
        let errormsg = '';

        generateTranLog(options.transactionId, TransactionStep.SendToMP, JSON.stringify(await util.generateDataLog("Id:" + options.transactionId, options)));
        const jresponse = await util.sendData(generateMPOrder(options));
        generateTranLog(options.transactionId, TransactionStep.ReceiveFromMP, JSON.stringify(await util.generateDataLog("", jresponse)))
        console.log("jresponse", jresponse);
        if (jresponse.hasOwnProperty("error")) {
            errormsg = jresponse.message;
            rtn = {
                info: "Error en comunicación con Mercado Pago.",
                error: jresponse.error,
                message: jresponse.message
            };
            status = TransactionStatus.Error;
        }
        else {
            const qrData = jresponse.qrData;
            console.log(qrData);
            const sqr = await QRCode.toDataURL(qrData);
            rtn = {
                qrData: sqr,
                tran: options.transactionId
            };
            status = TransactionStatus.InProcess;
        }

        let op = updateTransaction(options.transactionId, status, JSON.stringify(options), JSON.stringify(jresponse))
        const responsetu = await util.sendData(op);
        if (status == TransactionStatus.Error) {
            generateTranLog(options.transactionId, TransactionStep.OrderErrorFromMP, JSON.stringify(await util.generateDataLog("Error: " + errormsg, op)))
        }

    }
    catch (error) {
        console.error(error);
        rtn = {
            info: "Error en comunicación con Mercado Pago.",
            error: error.name,
            message: error.message
        };

        try {
            const body = JSON.parse(options.data);
            const code = body.external_reference;
            await util.sendData(updateTransaction(code, TransactionStatus.Error, JSON.stringify(options), JSON.stringify(rtn)));
        }
        catch (error1) {
            console.error(error1);
            rtn = {
                info: "Error en comunicación con el central.",
                error: error1.name,
                message: error1.message
            };

        }
    }
    return rtn;
}

function generateMPOrder(tran) {

    const options = {
        method: 'Post',
        maxBodyLength: Infinity,
        url: `${urlApi}/mp/generateOrder`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({

            transactionId: tran.transactionId,
            description: tran.description,
            amount: tran.amount,
            taxPercentage: tran.taxPercentage,
            tax: tran.tax,
            total: tran.total,
            status: tran.status,
            stamp: tran.stamp,
            terminalId: tran.terminalId,
            copies: tran.copies

        })
    };   
    return options;
}







async function handlecancelTran(event, options) {
    let rtn = {};
    try {

        let op = updateDataTransaction(options, TransactionStatus.Cancel, '', 0);
        const tran = await util.sendData(op);
        generateTranLog(tran.transactionId, TransactionStep.CancelPayment, JSON.stringify(await util.generateDataLog("", op)))
        rtn = {
            data: tran
        };
    }
    catch (error) {
        console.error(error);
        rtn = {
            info: "Error en comunicación con el sistema central.",
            error: error.name,
            message: error.message
        };
    }

    return rtn;
}

async function handleGetTran(event, options) {
    let rtn = {};
    try {
        const tran = await util.sendData(getTransaction(options));
        rtn = {
            data: tran
        };
    }
    catch (error) {
        console.error(error);
        rtn = {
            info: "Error en comunicación con el sistema central.",
            error: error.name,
            message: error.message
        };
    }
    return rtn;
}

async function handlePrintTran(event, options) {
    let rtn = {};
    try {

        rtn = await printTran(options);
    }
    catch (error) {
        console.error(error);
        rtn = {
            info: "Error General en impresión.",
            error: error.name,
            message: error.message
        };
    }

    return rtn;

}

const generateTransaction = (data) => {

    const nowformat = new Date().toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, -5);

    const options = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: `${urlApi}/Transaction`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            transactionId: "",
            description: `${termId}-${nowformat}`,
            amount: data.amount.toString(),
            tax: data.tax.toString(),
            taxPercentage: data.taxPercentage.toString(),
            total: data.total.toString(),
            status: 0,
            terminalId: termId,
            copies: 0,
            stamp: new Date(),
        })
    };
    return options;

}

const updateTransaction = (code, vstatus, request, response) => {


    const options = {
        method: 'Patch',
        maxBodyLength: Infinity,
        url: `${urlApi}/Transaction/${code}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            status: vstatus,
            orderRequestData: request,
            orderResponseData: response,
            cashierData: '',
            updatedBy: termId
        })
    };
    return options;

}

const updateDataTransaction = (code, vstatus, vcashierData, vcopies) => {

    const options = {
        method: 'Patch',
        maxBodyLength: Infinity,
        url: `${urlApi}/Transaction/updateData/${code}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            status: vstatus,
            orderRequestData: '',
            orderResponseData: '',
            cashierData: vcashierData,
            copies: vcopies,
            updatedBy: termId
        })
    };

    return options;
}

const getTransaction = (code) => {

    const options = {
        method: 'Get',
        maxBodyLength: Infinity,
        url: `${urlApi}/Transaction/${code}`,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return options;
}

async function generateTranLog(tid, vstep, vdata, vOperatormail, vOpertorlogId) {

    try {

        const data = {
            transactionLogId: "",
            description: vstep.description,
            data: vdata,
            transactionId: tid,
            step: vstep.value,
            stamp: new Date(),
        };

        if (vOperatormail !== undefined) {
            data.operatorEmail = vOperatormail;
            data.operatorLogId = vOpertorlogId;
        }

        const options = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: `${urlApi}/TransactionLog`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data)
            /*
            data: JSON.stringify({
                transactionLogId: "",
                description: vstep.description,
                data: vdata,
                transactionId: tid,
                step: vstep.value,
                stamp: new Date(),
            })
            */
        };


        const tran = await util.sendData(options);
    }
    catch (error) {
        console.error(error);
    }


}

async function PrintTicket(tran, cashierData) {

    let rtn = {};

    if (admin.getTerminal().printTicket && admin.getTerminal().printerTicketName != null && admin.getTerminal().printerTicketName != "") {

        if (tran.status == 2 || (tran.status == 4 && admin.getConfigGeneral().printCancelTransaction) || tran.status != 4 || cashierData.Message != "") {

            try {
                generateTranLog(tran.transactionId, TransactionStep.PrintTicket, JSON.stringify(await util.generateDataLog("", "")))
                let datap = ticketPrinter.generateData(tran, cashierData, false)
                ticketPrinter.printTicket(datap)


            } catch (e) {
                console.error(e);
                rtn = {
                    info: "Error al imprimir ticket.",
                    error: e.name,
                    message: e.message
                };

            }
        }
        else {
            generateTranLog(tran.transactionId, TransactionStep.PrintTicket, JSON.stringify(await util.generateDataLog("IMPRESIÓN DESHABILITADA POR CONFIGURACIÓN", "")))
        }
    }
    else {
        generateTranLog(tran.transactionId, TransactionStep.PrintTicket, JSON.stringify(await util.generateDataLog("IMPRESIÓN DESHABILITADA POR CONFIGURACIÓN", "")))
    }
    return rtn;

}

async function PrintTito(tran, cashierData) {
    let rtn = {};
    if (tran.status == 2) {
        if (admin.getTerminal().printTITO && admin.getTerminal().printerTITOCom != null && admin.getTerminal().printerTITOCom != "") {
            try {

                if (cashierData.Code == 0) {

                    let data = titoPrinter.generateData(tran, cashierData, admin.getConfigGeneral().TITOTitle);

                    let dataStatus = titoPrinter.status();
                    setTimeout(() => {
                    }, 2000);
                    if (dataStatus == "online") {
                        titoPrinter.printTito(data);
                        generateTranLog(tran.transactionId, TransactionStep.PrintTITO, JSON.stringify(await util.generateDataLog(data.validationFormat, data)))
                    }
                    else {
                        const trans = await util.sendData(updateDataTransaction(tran.transactionId, TransactionStatus.FinishTITOError, JSON.stringify(cashierData), 0));
                        generateTranLog(tran.transactionId, TransactionStep.PrintTITOError, JSON.stringify(await util.generateDataLog("Error:" + currentStatusData.statusprintersTITO, "")))
                    }
                }
            }
            catch (e) {
                const trans = await util.sendData(updateDataTransaction(tran.transactionId, TransactionStatus.FinishTITOError, JSON.stringify(cashierData), 0));
                generateTranLog(tran.transactionId, TransactionStep.PrintTITOError, JSON.stringify(await util.generateDataLog("Error:" + e.message, "")))
                rtn = {
                    info: "Error al imprimir Tito.",
                    error: e.name,
                    message: e.message
                };
            }
        }
        else {
            const trans = await util.sendData(updateDataTransaction(tran.transactionId, TransactionStatus.Finished, cashierData, 0));
            generateTranLog(tran.transactionId, TransactionStep.PrintTITO, JSON.stringify(await util.generateDataLog("IMPRESIÓN DESHABILITADA POR CONFIGURACIÓN", "")))
        }
    }
    return rtn;

}


async function printTran(tran) {
    let rtn = {};
    let errorcom = false;
    let cashierData =
    {
        Message: "",
    }
    if (tran.status == 2) {
        let op = admin.cashierComunication('Generar', '', parseFloat(tran.amount));
        generateTranLog(tran.transactionId, TransactionStep.SendToCashier, JSON.stringify(await util.generateDataLog("Terminal: " + admin.getTerminal().terminalcode + " Monto: " + (parseFloat(tran.amount) * 100).toString(), op)))
        try {

            if (admin.getTerminal().useCashier) {
                cashierData = await util.sendData(op);
            }
            else {
                cashierData =
                {
                    Code: 0,
                    Message: '',
                    ValidationId: '002411143240808173',
                    CreateDate: '20240627180149',
                    ExpirateDate: '20240727',
                    Sala: 'SALA CASHIER',
                    Data1: '',
                    Data2: '',
                }
            }

            if (cashierData.Code == 0) {
                generateTranLog(tran.transactionId, TransactionStep.ReceiveFromCashier, JSON.stringify(await util.generateDataLog("ValidationId: " + cashierData.ValidationId, cashierData)))
                const trans = await util.sendData(updateDataTransaction(tran.transactionId, TransactionStatus.Finished, JSON.stringify(cashierData), 0));
            }

        }
        catch (e) {
            console.error(e);
            cashierData =
            {
                Code: -1,
                Message: e.message,
                ValidationId: '',
                CreateDate: '',
                ExpirateDate: '',
                Sala: '',
                Data1: '',
                Data2: '',
            }
        }

        if (cashierData.Code != 0) {
            try {
                errorcom = true;
                const trancs = await util.sendData(updateDataTransaction(tran.transactionId, TransactionStatus.CancelCashierError, '', 0));
                tran.status = TransactionStatus.CancelCashierError;
                generateTranLog(tran.transactionId, TransactionStep.ReceiveCashierError, JSON.stringify(await util.generateDataLog("Error: " + cashierData.Message, cashierData)));
                rtn = {
                    info: "Error en comunicación con el sistema de caja.",
                    error: "Error",
                    message: cashierData.Message
                };
            }
            catch (e) {
                console.error(e);
                rtn = {
                    info: "Error en comunicación con el sistema de central.",
                    error: e.name,
                    message: e.message
                };
            }
        }
    }


    rtn = await PrintTicket(tran, cashierData)
    if (!errorcom) {
        rtn = await PrintTito(tran, cashierData)
    }


    return rtn

}


module.exports = {
    init,
    handlegenerateTran,
    handlegenerateQR,
    handlecancelTran,
    handleGetTran,
    handlePrintTran,
    generateTranLog,
    updateDataTransaction,
    TransactionStatus,
    TransactionStep,
};