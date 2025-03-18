const fs = require('fs');
const writtenNumber = require('written-number');

let imagecarruselData = [];

function sendData(options) {
    return new Promise(async (resolve, reject) => {
        //	console.log('sendData');
        //	console.log(options);
        const axios = require('axios');
        try {
            const response = await axios(options);
            //console.log(response.data);
            resolve(response.data);
        } catch (error) {
            try {
                if (error.response) {
                    console.log(options);
                    // console.log(error.response);
                    reject(new Error(error.response.data.message));
                }
                else if (error.isAxiosError) {
                    reject(new Error(error.cause));
                }
                else {
                    reject(new Error(error));
                }
            } catch (error1) {
                reject(new Error(error1));
            }
        }
    });
}

function saveLogo(imageData, filename) {
    try {
        if (imageData != null) {
            const content = imageData.data;
            fs.writeFileSync(filename, Buffer.from(content));
        } else {
            if (fs.existsSync(filename)) {
                fs.unlinkSync(filename);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}

function formatCurrencyValues(inputValues) {
    const valuesArray = inputValues.split(' | ');
    const formattedValues = valuesArray.map((value) => {
        const numericValue = parseInt(value.trim(), 10); // Convierte el valor a número
        const formattedAmount = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(numericValue);
        return formattedAmount;
    });

    return formattedValues.join(' | ');
}

function saveImagen(config, imageNumber) {
    try {
        const imageData = config[`carrouselImageData0${imageNumber}`];
        const filename = `views/assets/img/carrousel/C${imageNumber}.jpg`;
        if (imageData != null) {
            // Guardar la imagen
            const content = imageData.data;
            fs.writeFileSync(filename, Buffer.from(content));
            imagecarruselData.push(`../assets/img/carrousel/C${imageNumber}.jpg`);
        } else {
            if (fs.existsSync(filename)) {
                fs.unlinkSync(filename);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}

function formatDateYYYYMMDDHHmmss(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function convertAmount(amount) {

    writtenNumber.defaults.lang = 'es';
    const integerSingular = "peso";
    const integerPlural = "pesos";
    const fractionSingular = "centavo";
    const fractionPlural = "centavos";
    if (Math.abs(amount) > 999999999)
        throw new Error("Amount is out of range");

    // Separates the integer (integerPart) and decimal (decimalPart) parts.
    let integerPart = Math.trunc(Math.abs(amount));
    let decimalPart = Math.trunc(Math.round((Math.abs(amount) - integerPart) * 100));

    let words = "";
    if (amount < 0)
        words = "menos ";

    words = words.concat(writtenNumber(integerPart));
    if (integerPart === 1)
        words = words.concat(" ", integerSingular);
    else
        words = words.concat(" ", integerPlural);

    words = words.concat(" con ", writtenNumber(decimalPart));
    if (decimalPart === 1)
        words = words.concat(" ", fractionSingular);
    else
        words = words.concat(" ", fractionPlural);

    return words;
}

async function generateDataLog(vinfo, vdata) {
    return {
        info: vinfo,
        data: vdata
    };
}

function generateNumberValidation(number) {
    const grupos = [];
    for (let i = number.length; i > 0; i -= 4) {
        grupos.unshift(number.slice(Math.max(i - 4, 0), i));
    }
    return grupos.join('-');
}
module.exports = {
    sendData,
    saveLogo,
    formatCurrencyValues,
    saveImagen,
    formatDateYYYYMMDDHHmmss,
    convertAmount,
    generateDataLog,
    generateNumberValidation,
    imagecarruselData
};