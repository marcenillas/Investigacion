"use strict";

function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = text;
    }
}

updateElementText('node-version', window.versions.node());
updateElementText('chrome-version', window.versions.chrome());
updateElementText('electron-version', window.versions.electron());

const loadTime = async () => {
    const response = await window.global.loadTime()
}

loadTime()

const getConfig = (key) => {
    return localStorage.getItem(key);
}

async function showExcepcion(error) {
    return await showMessage('Excepción', error.name + '\n\n' + error.message, 'error')
}

async function showMessage(vtitle, vtext, vicon) {
    return await showCompleteMessage(vtitle, vtext, vicon, 'Aceptar', '-')
}

async function showCompleteMessage(vtitle, vtext, vicon, vconfirmButtonText, vcancelButtonText) {
    const swalConfig = {
        title: vtitle,
        text: vtext,
        icon: vicon,
        width: 600,
        confirmButtonColor: '#3085d6',
        confirmButtonText: vconfirmButtonText,
        footer: 'SIELCON Pay',
        allowOutsideClick: false,
    };
    if (vcancelButtonText != '-') {
        swalConfig.showCancelButton = true;
        swalConfig.cancelButtonColor = '#d33';
        swalConfig.cancelButtonText = vcancelButtonText;
    }

    return new Promise(async (resolve) => {
        const result = await Swal.fire(swalConfig);
        resolve(result);
    });

}

const getSatusData = () => {

    let statusData =
    {
        statusCENTRAL: getConfig('status.CENTRAL'),
        statusTERMINAL: getConfig('status.TERMINAL'),
        statusMP: getConfig('status.MP'),
        statusCASHIER: getConfig('status.CASHIER'),
        statusprintersTITO: getConfig('status.printers.TITO'),
        statusprintersTICKETS: getConfig('status.printers.TICKETS'),
        statusDoor: getConfig('status.Door'),

    };
    return statusData;
}

const validateStatus = (inmaintenance) => {

    const CENTRALStatus = getConfig('status.CENTRAL') == 'online';
    const TERMINALStatus = getConfig('status.TERMINAL') == 'enabled';
    const MPStatus = getConfig('status.MP') == 'online';
    const CASHIERStatus = getConfig('status.CASHIER') == 'online';
    const TITOStatus = getConfig('status.printers.TITO') == 'online';
    const TICKETSStatus = getConfig('status.printers.TICKETS') == 'online';
    const DoorStatus = getConfig('status.Door') == 'close';

    if (!TITOStatus || !TICKETSStatus || !CENTRALStatus || !TERMINALStatus || !MPStatus || !CASHIERStatus || !DoorStatus) {

        if (!inmaintenance) {
            Swal.fire({
                title: 'SE DETECTÓ UNA FALLA EN LA TERMINAL',
                html: 'Procesando información, espere unos segundos por favor.',
                timer: 1000,
                timerProgressBar: true,
                footer: 'SIELCON Pay',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                },
            }).then(() => window.location.href = "../00-maintenance/index.html");
        }
    }
    else {
        if (inmaintenance) {
            window.location.href = "../01-main/index.html";
        }
    }
}

const refreshStatus = () => {
    Swal.fire({
        title: 'VALIDANDO ESTADO DE LA TERMINAL',
        html: '<p></p>',
        timer: 3000,
        timerProgressBar: true,
        footer: 'SIELCON Pay',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('p')
            setInterval(() => {
                if (Swal.getTimerLeft() > 750 * 3) {
                    b.textContent = 'Validando estado de la impresora de TITO... '
                }
                else if (Swal.getTimerLeft() > 750 * 2) {
                    b.textContent = 'Validando estado de la impresora de tickets...'
                }
                else if (Swal.getTimerLeft() > 750 * 1) {
                    b.textContent = 'Validando conexión con sistema central...'
                }
                else {
                    b.textContent = 'Validando conexión con Mercado Pago...'
                }
            }, 100)
        },
    })
}

const getNextStep = () => {

    const modeDefined = getConfig('config.modeDefined') == 'true';
    const modeByQR = getConfig('config.modeByQR') == 'true';

    if (modeDefined) {
        if (modeByQR) {
            window.location.href = '../03-defined/index.html';//'../02-mode/index.html';
        }
        else {
            window.location.href = '../03-defined/index.html';
        }
    }
    else if (modeByQR) {
        window.location.href = '../03-defined/index.html';
    }
    else {
        window.location.href = '../00-exception/index.html?ex=1014';
    }
}

async function getTerminal() {
    return await window.admt.getTerminal("");
}

async function getConfigGeneral() {
    return await window.admg.getConfigGeneral("");
}




async function ActionOperador(op, url) {

    let options =
    {
        id: op
    };
    await window.oplogi.generateOperatorLog(options);
    window.location.href = url

}


async function operadorPrint(op) {
    try {

        const ptran = await window.oppri.operatorPrint(op);
        if (ptran.hasOwnProperty("error")) {
            await showMessage('Error', ptran.info, 'error');
        }
    } catch (error) {
        await showExcepcion(error);

    }
}

const getDefinedValues = () => {
    return getConfig('config.definedValues').split('|');
}

const getDefinedAmounts = () => {
    return getConfig('config.definedAmounts').split('|');
}

const getFeeBorneClientCharge = () => {
    return getConfig("config.mp.feeBorneClientCharge");
}

const getExpirateTransaction = () => {
    return getConfig("config.mp.expirateTransaction");
}



async function getTran(tran) { return await window.apig.getTran(tran); }

async function goToMainTran(tran) {
    try {
        await showCompleteMessage('¿ESTÁ SEGURO/A DE VOLVER AL INICIO?', 'Se perderán los datos ingresados.', 'question', 'Sí, volver al inicio', 'No')
            .then(async (result) => {
                if (result && result.value) {
                    try {
                        const jtran = await window.apic.cancelTran(tran);
                        if (jtran.hasOwnProperty("error")) {
                            //await showMessage('Error', jresponse.error + '\n\n' + jresponse.message, 'error');
                            await showMessage('Error', jtran.info, 'error');
                            window.location.href = '../01-main/index.html';
                        } else {
                            const ptran = await window.generalp.printTran(jtran.data);
                            if (ptran.hasOwnProperty("error")) {
                                //await showMessage('Error', jresponse.error + '\n\n' + jresponse.message, 'error');
                                await showMessage('Error', ptran.info, 'error');
                                window.location.href = '../01-main/index.html';
                            }
                        }
                    }
                    catch (error) {
                        await showExcepcion(error);
                    }
                    window.location.href = "../01-main/index.html";
                }
            });

    } catch (error) {
        await showExcepcion(error);
        window.location.href = '../01-main/index.html';
    }

}
async function paymentTimeout(tran) {
    try {
        await Swal.fire({
            title: 'Analizando Pago...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                Swal.showLoading();
                try {
                    const jtran = await window.apig.getTran(tran);
                    if (jtran.data.status == 2) {
                        await Swal.fire({
                            title: 'PAGO PROCESADO CON ÉXITO',
                            html: 'Imprimiendo Ticket por $' + jtran.data.amount,
                            icon: 'success',
                            timer: 2000,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,
                            didOpen: async () => {
                                Swal.showLoading();
                            },
                        }).then(async (result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                await Swal.fire({
                                    title: 'Imprimiendo...',
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    allowEnterKey: false,
                                    didOpen: async () => {
                                        Swal.showLoading();
                                        try {
                                            const ptran = await window.generalp.printTran(jtran.data);
                                            setTimeout(() => { Swal.close(); window.location.href = "../01-main/index.html"; }, 3000);

                                            if (ptran.hasOwnProperty("error")) {
                                                //await showMessage('Error', jresponse.error + '\n\n' + jresponse.message, 'error');
                                                await showMessage('Error', ptran.info, 'error');
                                                window.location.href = "../01-main/index.html";
                                            }
                                        }
                                        catch (error) {
                                            Swal.close()
                                            showExcepcion(error);
                                            window.location.href = "../01-main/index.html";
                                        }
                                    }
                                });


                            }
                        });
                    } else {

                        try {

                            await Swal.fire({
                                title: 'PAGO PROCESADO CON ERROR',
                                html: 'Cancelando Transacción',
                                icon: 'error',
                                timer: 2000,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                allowEnterKey: false,
                                didOpen: async () => {
                                    Swal.showLoading();
                                },
                            }).then(async (result) => {
                                if (result.dismiss === Swal.DismissReason.timer) {
                                    try {
                                        const jtran = await window.apic.cancelTran(tran);
                                        if (jtran.hasOwnProperty("error")) {
                                            //await showMessage('Error', jresponse.error + '\n\n' + jresponse.message, 'error');
                                            await showMessage('Error', jtran.info, 'error');
                                            window.location.href = '../01-main/index.html';
                                        } else {
                                            const ptran = await window.generalp.printTran(jtran.data);
                                            if (ptran.hasOwnProperty("error")) {
                                                //await showMessage('Error', jresponse.error + '\n\n' + jresponse.message, 'error');
                                                await showMessage('Error', ptran.info, 'error');
                                                window.location.href = '../01-main/index.html';
                                            }
                                        }
                                    }
                                    catch (error) {
                                        showExcepcion(error);
                                    }
                                    window.location.href = "../01-main/index.html";
                                }
                            });
                        } catch (error) {
                            await showExcepcion(error);
                            window.location.href = '../01-main/index.html';
                        }
                    }
                } catch (error) {
                    await showExcepcion(error);
                    window.location.href = '../01-main/index.html';
                }
            }
        });

    } catch (error) {
        await showExcepcion(error);
        window.location.href = '../01-main/index.html';
    }
}

async function goToConfirm() {
    const c = getCurrentAmount();
    if (c == 0) {
        await showMessage('DEBE INDICAR EL MONTO A DEPOSITAR', 'El monto a depositar debe ser mayor a cero.', 'warning')
    }
    else {
        window.location.href = `../05-confirm/index.html?amount=${c}`;
    }
}

function parseAmount(amountData) {
    let cleanedAmountData = amountData.replace('$', '');
    cleanedAmountData = cleanedAmountData.replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(cleanedAmountData);
    return amount;
}

const getimagecarruselData = () => {
    return getConfig('config.imagecarruselData').split('|');

}


async function generateQr(amountData) {
    try {     
        let rtn = {};
        var taxPercentage = getConfig("config.taxPercentage")
        const realamount = parseAmount(amountData)
        let taxValue = 0;
        let amount = realamount
        if (taxPercentage != "null") {
            taxPercentage = parseFloat(taxPercentage);
            amount = parseFloat(amount);
            taxValue = amount * taxPercentage / 100;
            amount = amount - taxValue;
        }
        amount = truncate(amount, 2);

        await Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                Swal.showLoading();
                try {
                    var tranOption =
                    {
                        amount: amount,
                        taxPercentage: taxPercentage,
                        tax: taxValue,
                        total: realamount
                    }

                   
                    const jtran = await window.api.generateTran(tranOption);
                    if (jtran.hasOwnProperty("error")) {
                        //await showMessage('Error', jresponse.error + '\n\n' + jresponse.message, 'error');
                        await showMessage('Error', jtran.info, 'error');
                        window.location.href = '../01-main/index.html';

                    } else {
                      // const jresponse = await window.mp.generateQR(generateMPOrderDataDinamic(jtran.data.transactionId, realamount, 'Carga', 'Carga'));
                      const jresponse = await window.mp.generateQR(jtran.data);
                      
                        if (jresponse.hasOwnProperty("error")) {

                            //await showMessage('Error', jresponse.error + '\n\n' + jresponse.message, 'error');
                            await showMessage('Error', jresponse.info, 'error');
                            window.location.href = '../01-main/index.html';
                        } else {
                            rtn = {
                                qrData: jresponse.qrData,
                                tran: jresponse.tran,
                                amount: "$" + amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })
                            };
                            Swal.close();
                        }
                    }
                } catch (error) {
                    await showExcepcion(error);
                    window.location.href = '../01-main/index.html';
                }
            }
        });
        return rtn;
    } catch (error) {
        await showExcepcion(error);
        window.location.href = '../01-main/index.html';
    }
}


async function getOperatorTran() {
    try {
        let rtn = {};

        await Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                Swal.showLoading();
                try {
                    const jtran = await window.optran.operatorTran();
                    if (jtran.hasOwnProperty("error")) {
                        //await showMessage('Error', jresponse.error + '\n\n' + jresponse.message, 'error');
                        await showMessage('Error', jtran.info, 'error');
                        window.location.href = '../00-operator/index.html';

                    } else {
                        rtn = {
                            data: jtran.data,
                        }
                        Swal.close();
                    }
                }
                catch (error) {
                    await showExcepcion(error);
                    window.location.href = '.../00-operator/index.html';
                }
            }
        });
        return rtn;
    } catch (error) {
        await showExcepcion(error);
        window.location.href = '../00-operator/index.html';
    }
}


async function operadorRePrint(op, tran) {
    try {

        await Swal.fire({
            title: 'Reimprimiendo...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async () => {
                Swal.showLoading();
                try {
                    const jtran = await window.apig.getTran(tran);
                    let r;
                    if (jtran.hasOwnProperty("error")) {
                        await showMessage('Error', jtran.info, 'error');
                    }
                    else if (op == 1) {
                        r = await window.oprtk.operatorRePrintTicket(jtran)
                    }
                    else if (op == 2) {
                        r = await window.oprti.operatorRePrintTito(jtran);
                    }
                    if (r.hasOwnProperty("error")) {
                        await showMessage('Error', r.info, 'error');
                    }

                } catch (error) {
                    showExcepcion(error);
                }
                window.location.href = "../00-Transaction/index.html";
            }
        });
    } catch (error) {
        await showExcepcion(error);
        window.location.href = '../00-Transaction/index.html';
    }
}

let keyPressTimes = {};
let intervalIds = {};
let secondaryIntervalIds = {};

function monitorKeyPress(targetKey, firstDuration, secondDuration, firstCallback, secondCallback, releaseCallback) {
    function startTimer() {
        if (!keyPressTimes[targetKey]) {
            keyPressTimes[targetKey] = Date.now();
            localStorage.setItem(`keyPressTime_${targetKey}`, keyPressTimes[targetKey]);
            
            if (firstDuration) {
                intervalIds[targetKey] = setInterval(() => checkFirstPressDuration(targetKey), 100); // Verificar cada 100 milisegundos
            }

            if (secondDuration) {
                secondaryIntervalIds[targetKey] = setInterval(() => checkSecondPressDuration(targetKey), 100); // Verificar cada 100 milisegundos
            }
        }
    }

    function stopTimer() {
        if (intervalIds[targetKey]) {
            clearInterval(intervalIds[targetKey]);
            delete intervalIds[targetKey];
        }
        
        if (secondaryIntervalIds[targetKey]) {
            clearInterval(secondaryIntervalIds[targetKey]);
            delete secondaryIntervalIds[targetKey];
        }
        
        delete keyPressTimes[targetKey];
        localStorage.removeItem(`keyPressTime_${targetKey}`);
        
        if (releaseCallback) {
            releaseCallback(targetKey);
        }
    }

    function checkFirstPressDuration() {
        if (firstDuration && Date.now() - keyPressTimes[targetKey] >= firstDuration) {
            if (firstCallback) firstCallback(targetKey);
        }
    }

    function checkSecondPressDuration() {
        if (Date.now() - keyPressTimes[targetKey] >= secondDuration) {
            if (secondCallback) secondCallback(targetKey);
        }
    }

    window.addEventListener("keydown", function(event) {
        if (event.key.toLowerCase() === targetKey.toLowerCase()) {
            startTimer();
        }
    });

    window.addEventListener("keyup", function(event) {
        if (event.key.toLowerCase() === targetKey.toLowerCase()) {
            stopTimer();
        }
    });

    // Sincronizar el estado de la tecla entre ventanas
    window.addEventListener('storage', (event) => {
        if (event.key === `keyPressTime_${targetKey}`) {
            keyPressTimes[targetKey] = event.newValue ? Number(event.newValue) : null;
        }
    });
}


function redirectToMaintenancePage() {
    monitorKeyPress('p', 1 * 1000, null, function (key) {       
        window.adme.setDoor('open');
        window.location.href = '../00-maintenance/index.html';
    }, null, null);
}

function redirectToOperatorPage() {
    monitorKeyPress('o', 1 * 1000, null, function (key) {
        ActionOperador(1 , '../00-operator/index.html')
    }, null, null);
}


function controlDoor() {
    let lastExecutionTime = 0
    monitorKeyPress('p', null, 5 * 1000, null, function (key) {
        const currentTime = Date.now();
        if (currentTime - lastExecutionTime >= 5 * 1000) {             
            window.adme.setDoor('open');
            lastExecutionTime = currentTime;
        }
    }, function (key) {       
        window.adme.setDoor('close');
    });
}

function truncate(num , decimalPlaces ) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(num * factor) / factor;
}