const util = require('./util');


let configGeneral = {};
let terminal = {};
let configg;
let mainWindow;
let printers




function init(vmainWindow, vconfig , terminalid) {
    mainWindow = vmainWindow;
    configg = {
        terminalId: terminalid,
        api: {
            url: vconfig.api.url
        }
    }

    mainWindow.webContents.getPrintersAsync().then((data) => {
        printers = data;
    }).catch((e) => {
        console.log(e.message);
    })
}

async function setConfigGeneral() {

    const responseBody = await util.sendData(getOptionConfigGeneral());
    config = responseBody[0];

    configGeneral = {
        mpauthorizationtoken: config.mpAuthorizationToken,
        mpUserId :  config.mpUserId,
        mpExpirateTransaction :  config.mpExpirateTransaction,
        feeBorneClientCharge :  config.feeBorneClientCharge,
        mpNotificationURL :  config.mpNotificationURL,
        taxPercentage :  config.taxPercentage,
        currencySimbol: config.currencySymbol,
        branchName: config.branchName,
        branchAddress: config.branchAddress,
        takeBranchNameConfiguration: config.takeBranchNameConfiguration,
        printCancelTransaction: config.printCancelTransaction,
        voucherTitle: config.voucherTitle,
        voucherLine1: config.voucherLine1,
        voucherLine2: config.voucherLine2,
        voucherLine3: config.voucherLine3,
    }

    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.mp.authorizationtoken", "${config.mpAuthorizationToken}");`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.mp.notificationurl", "${config.mpNotificationURL}");`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.mp.userid", "${config.mpUserId}");`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.taxPercentage", "${config.taxPercentage}");`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.mp.expirateTransaction", "${config.mpExpirateTransaction}");`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.mp.feeBorneClientCharge", "${config.feeBorneClientCharge}");`, true);

    util.saveLogo(config.logoMPImageData, 'views/assets/img/logomp.png');
    util.saveLogo(config.logoBranchImageData, 'views/assets/img/logobranch.png');
    util.saveLogo(config.logoCompanyImageData, 'views/assets/img/logocompany.png');
}

async function setConfigTerminal() {

    const config = await util.sendData(getoptionTerminal(configg.terminalId));
    terminal = {
        terminalcode: config.code,
        terminalName: config.name,

        description: config.description,
        enabled: config.enabled,
        modeQR: config.modeQR,
        modeFixed: config.modeFixed,
        status: config.status,
        printVoucher: config.printVoucher,
        printTicket: config.printTicket,
        printerTicketName: config.printerTicketName,
        printerVoucherCom: config.printerVoucherCom,
      
        definedValues :config.definedValues,
        storeId:  config.storeId,
        posId : config.posId,
        useCash: config.useCash,
      

        
    }
    let definedAmounts = util.formatCurrencyValues(config.definedValues);

    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.modeDefined", ${config.modeFixed});`, true)
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.modeByQR", ${config.modeQR});`, true)
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.definedValues", "${config.definedValues}");`, true)
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.definedAmounts", "${definedAmounts}");`, true)
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.storeid", "${config.storeId}");`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.posid", "${config.posId}");`, true);


    util.saveImagen(config, 1);
    util.saveImagen(config, 2);
    util.saveImagen(config, 3);
    util.saveImagen(config, 4);
    util.saveImagen(config, 5);

    var a = util.imagecarruselData.join('|');
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("config.imagecarruselData", "${a}");`, true);

}

const getOptionConfigGeneral = () => {
    const urlApi = configg.api.url;

    const options = {
        method: 'Get',
        maxBodyLength: Infinity,
        url: `${urlApi}/Configuration`,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return options;
}

const getoptionTerminal = (code) => {
    const urlApi = configg.api.url;

    const options = {
        method: 'Get',
        maxBodyLength: Infinity,
        url: `${urlApi}/Terminal/findById/${code}`,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return options;
}

const getoptionStatusTerminal = (code) => {
    const urlApi = configg.api.url;

    const options = {
        method: 'Get',
        maxBodyLength: Infinity,
        url: `${urlApi}/Terminal/checkStatus/${code}`,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return options;
}




function getConfig() {
    return configg
}

function getConfigGeneral() {
    return configGeneral;
}

function getTerminal() {
    return terminal;
}

function getPrinters() {
    return printers;
}

function setBranchName(tran, cashData) {
    if (tran.status == 2) {
        if (cashData.Branch != "" && !configGeneral.takeBranchNameConfiguration)
            namebranch = cashData.Branch;
        else if (configGeneral.branchName != "" && configGeneral.takeBranchNameConfiguration)
            namebranch = configGeneral.branchName;

        if (namebranch == "") {
            if (cashData.Branch != "")
                namebranch == cashData.Branch;
            else
                namebranch = configGeneral.branchName;

        }
    }
    else {
        namebranch = configGeneral.branchName;
    }
    if (namebranch == "")
        namebranch = "-";

    return namebranch
}



const MPStatus = () => {
    const urlApi = configg.api.url;
    let terminal = configg.terminalId   
    const options = {
        method: 'Post',
        maxBodyLength: Infinity,
        url: `${urlApi}/mp/status`,
        headers: {
            'Content-Type': 'application/json',           
        },
        data: JSON.stringify({
            terminalId: terminal,
            enabled : true
        })
    };
    return options;

}

const getCallbackURLMP = () => {
    //Obtiene la caja para testear que esta todo bien.
    const options = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: configGeneral.mpNotificationURL,
        headers: {
            'Content-Type': 'application/json',          
        },
    };   
    return options;

}





const cashComunication = (metodo, validationId, amount) => {
    const urlApi = configg.api.url;
    const options = {
        method: 'Post',
        maxBodyLength: Infinity,
        url: `${urlApi}/Cash/${metodo}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            code: terminal.terminalcode,
            validationId: validationId,
            montoCents: amount != '' ? Math.round((amount * 100)).toString() : amount,
        })
    };
    return options;

}






module.exports = {
    init,
    setConfigGeneral,
    setConfigTerminal,
    setBranchName,
    getConfigGeneral,
    getTerminal,
    getConfig,
    getPrinters,
    getOptionConfigGeneral,
    getoptionTerminal,
    getoptionStatusTerminal,
    cashComunication,
    MPStatus,
    getCallbackURLMP

};