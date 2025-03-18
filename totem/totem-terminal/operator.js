const util = require('./util');
const admin = require('./admin');
const titoPrinter = require('./titoprinter');
const ticketPrinter = require('./ticketprinter');
const transaction = require('./transaction');

let urlApi;
let termId;
let operatormail = "marcenillas@horizon.com.ar"
const OpertorAction = {

    Entry: { value: 1, description: 'Ingreso' },
    PrintTestTicket: { value: 2, description: 'Impresión Ticket' },
    PrintTestTITO: { value: 3, description: 'Impresión TITO' },
    RePrintTransactionTITO: { value: 4, description: 'Re Impresión transacción TITO' },
    Exit: { value: 5, description: 'Salir' },
    Transactions: { value: 6, description: 'Transacciones' },
    RePrintTransactionTicket: { value: 7, description: 'Re Impresión transacción Ticket' },
    Configuration: { value: 8, description: 'Configuración' },
    ConfigurationUpdate: { value: 9, description: 'Actualizar Configuración' },
};

function init() {
    urlApi = admin.getConfig().api.url;
    termId = admin.getConfig().terminalId;
}


async function handleGenerateOperatorLog(event, options) {
    let rtn = {};
    try {

        let vaction
        let vdata = JSON.stringify(await util.generateDataLog("", ""));
        if (options.id == 1)
            vaction = OpertorAction.Entry
        if (options.id == 5)
            vaction = OpertorAction.Exit
        if (options.id == 6)
            vaction = OpertorAction.Transactions
        if (options.id == 8)
            vaction = OpertorAction.Configuration
        if (options.id == 9)
        {
            vaction = OpertorAction.ConfigurationUpdate
            await admin.setConfigGeneral();            
            await admin.setConfigTerminal();
        }

        const tran = await generateOperatorLog(vaction, vdata);

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

async function handleOperatorPrint(event, options) {

    let rtn = {};
    const date = new Date();
    let tran =
    {
        transactionId: '00000000-0000-0000-0000-000000000000',
        description: '00000000-0000-0000-0000-000000000000-20010000000',
        paymentMethod: 'test',
        amount: '0',
        taxPercentage: '0',
        tax: '0',
        feeBorneClientCharge: true,
        mpFee: 0,
        mpTax: 0,
        total: '0',
        mptotal: '0',
        orderRequestData: '',
        orderResponseData: '',
        merchantOrderData: '',
        paymentData: '',
        stamp: date,
        status: 2,
        terminalId: 'd384d0c3-1b0b-4aac-bcbb-9d6e34d379f3',
        operatorEmail: null,
        createdBy: 'system',
        createdAt: date,
        mpCode: '989897',
        updatedBy: 'system',
        updatedAt: date,
    }

    const dateone = new Date()
    dateone.setDate(dateone.getDate() + 1);
    cashierData =
    {
        Code: 0,
        Message: '',
        ValidationId: '000000000000000000',
        CreateDate: util.formatDateYYYYMMDDHHmmss(date),
        ExpirateDate: util.formatDateYYYYMMDDHHmmss(dateone),
        Sala: 'SALA PRUEBA',
        Data1: '',
        Data2: '',
    }

    if (options == 1) {

        rtn = await PrintTicketOperator(tran, cashierData, true)

    }
    else if (options == 2) {

        rtn = await PrintTitoOperator(tran, cashierData, '*TITO DE PRUEBA*' , true)

    }

    return rtn;
}


async function handleOperatorTran(event, options) {
    let rtn = {};
    try {
        const tran = await util.sendData(getOperartorTrans());

        rtn = {
            data: tran.data
        };
    }
    catch (error) {
        console.error(error);
        rtn = {
            info: "Error obteniendo transacciones.",
            error: error.name,
            message: error.message
        };
    }
    return rtn;

}

async function generateOperatorLog(vaction, vdata) {
    let tran;
    try {
        const options = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: `${urlApi}/OperatorLog`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                operatorLogId: "",
                operatorEmail: operatormail,
                terminalId: termId,
                data: vdata,
                operatorAction: vaction.value,
                description: vaction.description,
                stamp: new Date(),
            })
        };
        tran = await util.sendData(options);
    }
    catch (error) {
        console.error(error);
    }
    return tran;

}

async function PrintTitoOperator(tran, cashierData, title , test) {
    let rtn = {};
    if (admin.getTerminal().printTITO && admin.getTerminal().printerTITOCom != null && admin.getTerminal().printerTITOCom !== "") {
        try {
            let data = titoPrinter.generateData(tran, cashierData, title);
            let dataStatus = titoPrinter.status();
            setTimeout(() => {
            }, 2000);
            if (dataStatus == "online") {               
                titoPrinter.printTito(data);
                if (test)
                {                  
                    generateOperatorLog(OpertorAction.PrintTestTITO, JSON.stringify(await util.generateDataLog(data.validationFormat, data)))
                }
            }
            else {
                let str = "Impresora no disponible " + dataStatus + "."
                generateOperatorLog(test?OpertorAction.PrintTestTITO : OpertorAction.handleOperatorRePrintTito, JSON.stringify(await util.generateDataLog("Error:" + str, data)))
                rtn = {
                    info: str,
                    error: str,
                    message: str
                };
            }
        }
        catch (e) {
            console.log(e);
            let str = "Error al imprimir TITO."
            generateOperatorLog(test?OpertorAction.PrintTestTITO : OpertorAction.handleOperatorRePrintTito , JSON.stringify(await util.generateDataLog(str, e)))
            rtn = {
                info: str,
                error: e.name,
                message: e.message
            };
        }
    }
    else {
        let str = "Impresora no configurada."
        generateOperatorLog(OpertorAction.PrintTestTITO, JSON.stringify(await util.generateDataLog("Error:" + str, admin.getTerminal())))
        rtn = {
            info: str,
            error: str,
            message: str
        };
    }
    return rtn;

}

async function PrintTicketOperator(tran, cashierData, test) {
    let rtn = {};
    if (admin.getTerminal().printTicket && admin.getTerminal().printerTicketName != null && admin.getTerminal().printerTicketName != "") {

        try {

            if (test) {
                generateOperatorLog(OpertorAction.PrintTestTicket, JSON.stringify(await util.generateDataLog("Id:" + tran.transactionId, tran)))
            }
            let datap = ticketPrinter.generateData(tran, cashierData, test)
            ticketPrinter.printTicket(datap)

        } catch (e) {
            console.error(e);
            let str = "Error al imprimir Ticket."
            generateOperatorLog(test?OpertorAction.PrintTestTicket : OpertorAction.RePrintTransactionTicket, JSON.stringify(await util.generateDataLog(str, tran)))
            rtn = {
                info: str,
                error: e.name,
                message: e.message
            };

        }
    }
    else {
        let str = "Impresora no configurada."
        generateOperatorLog(test?OpertorAction.PrintTestTicket : OpertorAction.RePrintTransactionTicket, JSON.stringify(await util.generateDataLog("Error:" + str, admin.getTerminal())))
        rtn = {
            info: str,
            error: str,
            message: str
        };
    }
    return rtn;

}

async function handleOperatorRePrintTicket(event, options) {

    let rtn = {};
    try {

        let cashierData =
        {
            Code: 0,
            Message: '',
            ValidationId: '',
            CreateDate: '',
            ExpirateDate: '',
            Sala: '',
            Data1: '',
            Data2: '',
        }
        if (options.data.cashierData)
            cashierData = JSON.parse(options.data.cashierData)

        opl = await generateOperatorLog(OpertorAction.RePrintTransactionTicket, JSON.stringify(await util.generateDataLog("Id:" + options.data.transactionId, options.data)))

        transaction.generateTranLog(options.data.transactionId, transaction.TransactionStep.RePrintTicket,
            JSON.stringify(await util.generateDataLog("Operator:" + operatormail, opl)), operatormail, opl.operatorLogId);



        rtn = await PrintTicketOperator(options.data, cashierData, false);

    }
    catch (error) {
        console.error(error);
        rtn = {
            info: "Error Reimprimiento Ticket.",
            error: error.name,
            message: error.message
        };
    }
    return rtn
}

async function handleOperatorRePrintTito(event, options) {
    let rtn = {};
    try {
        
        opl = await generateOperatorLog(OpertorAction.RePrintTransactionTITO, JSON.stringify(await util.generateDataLog(util.generateNumberValidation(JSON.parse(options.data.cashierData).ValidationId) , options.data)))

        transaction.generateTranLog(options.data.transactionId, transaction.TransactionStep.RePrintTITO,
            JSON.stringify(await util.generateDataLog("Operator:" + operatormail, opl)), operatormail, opl.operatorLogId);


        const copies = options.data.copies !== null && options.data.copies !== undefined ? options.data.copies : 0;
        util.sendData(transaction.updateDataTransaction(options.data.transactionId, options.data.status, '', copies + 1));


        if (options.data.status == transaction.TransactionStatus.Finished || options.data.status == transaction.TransactionStatus.FinishTITOError) {
            rtn = await PrintTitoOperator(options.data, JSON.parse(options.data.cashierData), admin.getConfigGeneral().TITOTitle ,false);
        }
        else
            rtn = {
                info: "No se puede reimprimir el TITO transacción en estado no valido.",
                error: '',
                message: ''
            };
    }
    catch (error) {
        console.error(error);
        rtn = {
            info: "Error Reimprimiento TITO.",
            error: error.name,
            message: error.message
        };
    }
    return rtn


}


const getOperartorTrans = () => {

    const options = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: `${urlApi}/transaction/TransactionByTerminal`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            terminalId: termId,
        })
    };
    return options;
};




module.exports = {
    init,
    handleGenerateOperatorLog,
    handleOperatorPrint,
    handleOperatorTran,
    handleOperatorRePrintTicket,
    handleOperatorRePrintTito,
};