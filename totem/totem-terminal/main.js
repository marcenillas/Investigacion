const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const { join } = require('node:path');
const { existsSync } = require('fs');
const yargs = require('yargs');
//const debug = require('electron-debug');
const logger = require('./js/logger');
const { Console, error } = require('node:console');

var macaddress = require('macaddress');

const argv = yargs.argv;
const util = require('./util');
const admin = require('./admin');
const transaction = require('./transaction');
const operator = require('./operator');
const voucherPrinter = require('./voucherprinter');
const ticketPrinter = require('./ticketprinter');

if (!argv.config)  { throw new Error('Argumento config requerido para iniciar');  }
if (!existsSync(argv.config)) { throw new Error('El archivo de configuración especificado no existe');  }

const config = require(`${process.platform === 'win32' ? '.\\' : './/'}${argv.config}`);

logger.info(`Iniciando aplicación con configuración: ${argv.config}`);

//if (config.devTools) debug();

require('events').EventEmitter.defaultMaxListeners = 20;

let tid;
let mainWindow;
let currentStatusData =
{
    statusCENTRAL: "online",
    statusTERMINAL: "enabled",
    statusMP: "online",
    statusCash: "online",
    statusprintersVoucher: "online",
    statusprintersTICKETS: "online",
    statusDoor: "close"
};

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        maximize: true,
        fullscreen: config.window.fullScreen,
        autoHideMenuBar: config.window.hideMenuBar,
        width: config.window.width,
        height: config.window.height,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
        }
    })
    nativeTheme.themeSource = 'dark'


    tid = await GetTerminalid();
    
   console.log('TerminalId:', tid);
   
    try {
        admin.init(mainWindow, config , tid)
        var vcode = 1015;
        await admin.setConfigGeneral();
        vcode = 1017
        await admin.setConfigTerminal();
        vcode = 1016
        voucherPrinter.init();
        ticketPrinter.init()
        transaction.init()
        operator.init()
        setStatus();
        setInterval(() => {
            try {
                setStatus();
            }
            catch (e) {
                console.log(e);
            }
        }, 3000);

        const data = { op: 'ok' };
        return mainWindow.loadFile('./views/01-main/index.html', { query: { data: JSON.stringify(data) } });
    }
    catch (e) {
        console.log(e);
        const data = { op: 'err', code: vcode };
        return mainWindow.loadFile('./views/01-main/index.html', { query: { data: JSON.stringify(data) } });
    }


}

async function GetTerminalid() {

    let rtn
    try {
        const all = await macaddress.all();
        const macList = Object.values(all).map(interface => interface.mac);
        macList.push('AAAAAAFFFFFF');
        const t = await util.sendData(getoptionTerminalByCode(macList));        
         rtn = t.terminalId;
    
    } catch (error) {
        console.error('Error:', error);
    }
    return rtn;

 
}

const getoptionTerminalByCode = (macList) => {
    const urlApi = config.api.url;

    const options = {
        method: 'Post',
        maxBodyLength: Infinity,
        url: `${urlApi}/Terminal/findByCode`,

        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(macList)
    };   
    return options;
  
}

async function setStatus() {
    let statusData =
    {
        statusCENTRAL: currentStatusData.statusCENTRAL,
        statusTERMINAL: currentStatusData.statusTERMINAL,
        statusMP: currentStatusData.statusMP,
        statusCash: currentStatusData.statusCash,
        statusprintersVoucher: currentStatusData.statusprintersVoucher,
        statusprintersTICKETS: currentStatusData.statusprintersTICKETS,
        statusDoor: currentStatusData.statusDoor,
    };
    try {
        await util.sendData(admin.getOptionConfigGeneral());
        statusData.statusCENTRAL = "online";
    }
    catch (e) {
        statusData.statusCENTRAL = "offline";
    }

    mainWindow.webContents.executeJavaScript(`localStorage.setItem("status.CENTRAL", "${statusData.statusCENTRAL}");`, true);
    if (currentStatusData.statusCENTRAL != statusData.statusCENTRAL) {
        currentStatusData.statusCENTRAL = statusData.statusCENTRAL;
        generateEvent("statusCENTRAL:" + statusData.statusCENTRAL);
    }

    try {
        const configt = await util.sendData(admin.getoptionStatusTerminal(tid));
        if (configt.enabled) {
            statusData.statusTERMINAL = "enabled";
        }
        else {
            statusData.statusTERMINAL = "disabled";
        }
    }
    catch (e) {
        statusData.statusTERMINAL = "offline";
    }

    mainWindow.webContents.executeJavaScript(`localStorage.setItem("status.TERMINAL", "${statusData.statusTERMINAL}");`, true);
    if (currentStatusData.statusTERMINAL != statusData.statusTERMINAL) {
        currentStatusData.statusTERMINAL = statusData.statusTERMINAL;
        generateEvent("statusTERMINAL:" + statusData.statusTERMINAL);
    }

    try {
        let rtn = await util.sendData(admin.MPStatus());
        if (rtn)
            statusData.statusMP = "online";
        else
            statusData.statusMP = "offline";
    }
    catch (e) {
        console.error(e);
        statusData.statusMP = "offline";
    }
    /*
        try {
            await util.sendData(admin.getCallbackURLMP());
            statusData.statusMP = "online";
        }
        catch (e) {
            console.error(e);
            statusData.statusMP = "coffline";
        }
    */

    mainWindow.webContents.executeJavaScript(`localStorage.setItem("status.MP", "${statusData.statusMP}");`, true);
    if (currentStatusData.statusMP != statusData.statusMP) {
        currentStatusData.statusMP = statusData.statusMP;
        generateEvent("statusMP:" + statusData.statusMP);
    }

    if (admin.getTerminal().useCash) {
        try {
            const config = await util.sendData(admin.cashComunication('Status', '', ''));
            if (config.Value == 0) {
                statusData.statusCash = "online";
            }
            else {
                statusData.statusCash = "offline";
            }
        }
        catch (e) {
            console.error(e);
            statusData.statusCash = "offline";
        }
    }
    else {
        statusData.statusCash = "online";
    }
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("status.CASH", "${statusData.statusCash}");`, true);
    if (currentStatusData.statusCash != statusData.statusCash) {
        currentStatusData.statusCash = statusData.statusCash;
        generateEvent("statusCash:" + statusData.statusCash);
    }

    const statusp = voucherPrinter.status();
    setTimeout(() => {
    }, 3000);
    statusData.statusprintersVoucher = statusp;

    mainWindow.webContents.executeJavaScript(`localStorage.setItem("status.printers.Voucher", "${statusData.statusprintersVoucher}");`, true);
    if (currentStatusData.statusprintersVoucher != statusData.statusprintersVoucher) {
        currentStatusData.statusprintersVoucher = statusData.statusprintersVoucher;
        generateEvent("statusprintersVoucher:" + statusData.statusprintersVoucher);
    }



    try {
        statusData.statusprintersTICKETS = ticketPrinter.status();
    }
    catch (e) {
        statusData.statusprintersTICKETS = "offline";
    }
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("status.printers.TICKETS",  "${statusData.statusprintersTICKETS}");`, true);
    if (currentStatusData.statusprintersTICKETS != statusData.statusprintersTICKETS) {
        currentStatusData.statusprintersTICKETS != statusData.statusprintersTICKETS
        generateEvent("statusprintersTICKETS:" + statusData.statusprintersTICKETS);
    }
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("status.Door", "${statusData.statusDoor}");`, true);
}

async function setDoor(event, options) {
    currentStatusData.statusDoor = options
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("status.Door", "${currentStatusData.statusDoor}");`, true);
    generateEvent("statusDoor:" + currentStatusData.statusDoor);
}

async function generateEvent(vdata) {
    try {
        const urlApi = config.api.url;
        const termId = tid;

        const options = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: `${urlApi}/Event`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                eventId: "",
                code: `${termId}-${vdata}`,
                description: vdata,
                data: vdata,
                stamp: new Date(),
                type: 0,
                terminalId: termId,
            })
        };
        const tran = await util.sendData(options);
    }
    catch (error) {
        console.error(error);
    }
}



app.whenReady().then(() => {
    ipcMain.handle('loadTime', () => 'TOT')
    ipcMain.handle('generateQR', transaction.handlegenerateQR)
    ipcMain.handle('generateTran', transaction.handlegenerateTran)
    ipcMain.handle('cancelTran', transaction.handlecancelTran)
    ipcMain.handle('getTran', transaction.handleGetTran)
    ipcMain.handle('printTran', transaction.handlePrintTran);
    ipcMain.handle('generateOperatorLog', operator.handleGenerateOperatorLog);
    ipcMain.handle('operatorPrint', operator.handleOperatorPrint);
    ipcMain.handle('operatorTran', operator.handleOperatorTran);
    ipcMain.handle('operatorRePrintTicket', operator.handleOperatorRePrintTicket);
    ipcMain.handle('operatorRePrintVoucher', operator.handleOperatorRePrintVoucher);
    ipcMain.handle('getTerminal', () => admin.getTerminal());
    ipcMain.handle('getConfigGeneral', () => admin.getConfigGeneral());
    ipcMain.handle('setDoor', setDoor);
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

