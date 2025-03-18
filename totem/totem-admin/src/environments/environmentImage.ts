
export interface ConfigImage {
    minHeight:  number;
    maxHeight: number;
    minWidth: number;
    maxWidth: number;
    maxImageSizeMB: number;
}


export interface EnvironmentConfig {
    configImage: {
        [key: string]: ConfigImage;
    };
}

export const environmentImage :EnvironmentConfig= {
    configImage: {
        logoMP: {
            minHeight: 10,
            maxHeight: 2000,
            minWidth: 10,
            maxWidth: 20000,
            maxImageSizeMB: 5000
        },
        logoGeneral: {
            minHeight: 10,
            maxHeight: 2000,
            minWidth: 10,
            maxWidth: 20000,
            maxImageSizeMB: 5000
        },
        logoCarrusel: {
            minHeight: 10,
            maxHeight: 2000,
            minWidth: 10,
            maxWidth: 20000,
            maxImageSizeMB: 5000
        }
    }
}
