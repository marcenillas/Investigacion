const { SerialPort } = require('serialport');
const admin = require('./admin');
const util = require('./util');

let _buffer = Buffer.alloc(0);
let _sendstatus = false;
let timeoutId;

let port;
let statusPrinter = 'online';

function init() {

    if (admin.getTerminal().printTITO && admin.getTerminal().printerTITOCom != null && admin.getTerminal().printerTITOCom != "") {
        const connectPort = () => {
            port = new SerialPort({
                path: admin.getTerminal().printerTITOCom,
                baudRate: 38400,
                dataBits: 8,
                stopBits: 1,
                parity: 'none',
                autoOpen: false,
            });
        
            port.open((err) => {
                if (err) {
                    console.error('Error opening port:', err.message);
                    setTimeout(connectPort, 1000); // Reintentar conexión después de 1 segundo
                } 
            });
        
            port.on('data', (data) => {
                if (_sendstatus) {
                    accumulateData(data);
                    analyzeData();
                }
            });
        
            port.on('error', (err) => {
                console.error('Error en el puerto serial:', err.message);
            });
        
            port.on('close', () => {                
                setTimeout(connectPort, 1000); // Reintentar conexión después de 1 segundo
            });
        };
        
        connectPort();
    }
}

function sendCom(...data) {
    if (typeof data[0] === 'string') {
        port.write(data.join(''));
    } else {
        port.write(Buffer.from(data));
    }
}

function status() {
    try {
        if (admin.getTerminal().printTITO && admin.getTerminal().printerTITOCom != null && admin.getTerminal().printerTITOCom !== "") {
            _sendstatus = true;
            sendCom(5);
            timeoutId = setTimeout(() => {
                _sendstatus = false;
                statusPrinter = 'offline';

            }, 3000);
        } else {
            clearTimeout(timeoutId);
            statusPrinter = 'online';
        }
    } catch (e) {
        console.error(e);
        statusPrinter = 'error';

    }
    return statusPrinter
}


function accumulateData(data) {
    _buffer = Buffer.concat([_buffer, data]);
}

function analyzeData() {
    const receivedString = _buffer.toString();
    const s = receivedString.split('|');

    if (s.length >= 10) {
        let veryReturn;
        clearTimeout(timeoutId);
        try {
            const c1 = s[3].charCodeAt(0).toString(2).padStart(8, '0');
            const c5 = s[5].charCodeAt(0).toString(2).padStart(8, '0');
            if (c1[4] === '1') {
                veryReturn = 'open';
            } else if (c1[5] === '1') {
                veryReturn = 'papeout';
            } else if (c5[4] === '1') {
                veryReturn = 'online'; // Es busy pero es que está imprimiendo
            } else {
                veryReturn = 'online';
            }
        } catch (err) {
            veryReturn = 'error';
        } finally {
            _sendstatus = false;
            _buffer = Buffer.alloc(0); // Borra los datos acumulados
        }
        statusPrinter = veryReturn;
    } else {
        statusPrinter = 'incomplete';
    }
    return statusPrinter;
}

function printTito(data) {
    if (port.isOpen) {
        // Printer Mode
        sendCom('^P|9|1|');
        sendCom(data.validationFormat, "|");
        sendCom(data.line1, "|");
        sendCom(data.line2, "|");
        sendCom(data.line3, "|");
        sendCom(data.title, "|");
        sendCom("Validacion|");
        sendCom(data.validationFormat, "|");
        sendCom(data.date, "|");
        sendCom(data.time, "|");
        sendCom(data.ticket, "|");
        sendCom(data.amountWords, "|");
        sendCom(" |");
        sendCom(data.amountNumbers, "|");
        sendCom(data.expiry, "|");
        sendCom(data.caja, "|");
        sendCom(data.validation.toString().padStart(18, '0'), "|");
        sendCom("^");
        setTimeout(() => { }, 200);
    }
}

function generateData(tran, cashierData, vtitle) {

    const dates = formateDateTito(cashierData.CreateDate, cashierData.ExpirateDate)    
    const validacionf =util.generateNumberValidation(cashierData.ValidationId)

    let data = {
        ticket: '', 
        validation: cashierData.ValidationId,
        validationFormat: validacionf,
        copy: 1,
        date: 'Fecha' + dates.dateFormat,
        time: 'Hora ' + dates.hoursFormat,
        line1: admin.setSalaName(tran,cashierData),
        line2: '',
        line3: '',
        amountNumbers: admin.getConfigGeneral().currencySimbol + parseFloat(tran.amount,).toFixed(2), //faltaconfiguracion
        amountWords: util.convertAmount(parseFloat(tran.amount).toFixed(2)),
        expiry: 'Expiracion en ' + dates.diferentDays + ' dias',
        caja: 'Terminal # ' + admin.getTerminal().terminalName   ,
        title: vtitle
     };
    
      return  data;


}



function formateDateTito(timeGeneratedString, timeExpirationString) {

    const timeGenerated = new Date(
        timeGeneratedString.slice(0, 4), // Año
        parseInt(timeGeneratedString.slice(4, 6)) - 1, // Mes (restamos 1 porque los meses en JavaScript son base 0)
        timeGeneratedString.slice(6, 8), // Día
        timeGeneratedString.slice(8, 10), // Hora
        timeGeneratedString.slice(10, 12), // Minuto
        timeGeneratedString.slice(12, 14) // Segundo
    );

    const timeExpiration = new Date(
        timeExpirationString.slice(0, 4),
        parseInt(timeExpirationString.slice(4, 6)) - 1,
        timeExpirationString.slice(6, 8)
    );

    const hours = timeGenerated.getHours();
    const minutes = timeGenerated.getMinutes();
    const day = timeGenerated.getDate();
    const month = timeGenerated.getMonth() + 1; // Sumamos 1 porque los meses en JavaScript son base 0
    const year = timeGenerated.getFullYear();

    return {
        dateFormat: `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`,
        hoursFormat: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,

        diferentDays: Math.max(1, Math.ceil((timeExpiration - timeGenerated) / (1000 * 60 * 60 * 24)))
    }
}



module.exports = {
    init,
    status,
    generateData,
    printTito,
   
};