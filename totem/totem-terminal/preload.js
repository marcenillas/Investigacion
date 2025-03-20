const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('versions', {
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('global', {
	loadTime: () => ipcRenderer.invoke('loadTime'),
})

contextBridge.exposeInMainWorld('request', {
	sendData: (options) => ipcRenderer.invoke('sendData',options),
})

contextBridge.exposeInMainWorld('mp', {
	generateQR: (options) => ipcRenderer.invoke('generateQR',options),
})

contextBridge.exposeInMainWorld('api', {
	generateTran: (options) => ipcRenderer.invoke('generateTran',options),
})

contextBridge.exposeInMainWorld('apic', {
	cancelTran: (options) => ipcRenderer.invoke('cancelTran',options),
})

contextBridge.exposeInMainWorld('apig', {
	getTran: (options) => ipcRenderer.invoke('getTran',options),
})

contextBridge.exposeInMainWorld('generalp', {
	printTran: (options) => ipcRenderer.invoke('printTran',options),
})

contextBridge.exposeInMainWorld('oplogi', {
	generateOperatorLog: (options) => ipcRenderer.invoke('generateOperatorLog',options),
})

contextBridge.exposeInMainWorld('oppri', {
	operatorPrint: (options) => ipcRenderer.invoke('operatorPrint',options),
})

contextBridge.exposeInMainWorld('optran', {
	operatorTran: (options) => ipcRenderer.invoke('operatorTran',options),
})

contextBridge.exposeInMainWorld('oprtk', {
	operatorRePrintTicket: (options) => ipcRenderer.invoke('operatorRePrintTicket',options),
})

contextBridge.exposeInMainWorld('oprti', {
	operatorRePrintVoucher: (options) => ipcRenderer.invoke('operatorRePrintVoucher',options),
})

contextBridge.exposeInMainWorld('admt', {
	getTerminal: (options) => ipcRenderer.invoke('getTerminal',options),
})

contextBridge.exposeInMainWorld('admg', {
	getConfigGeneral: (options) => ipcRenderer.invoke('getConfigGeneral',options),
})


contextBridge.exposeInMainWorld('adme', {
	setDoor: (options) => ipcRenderer.invoke('setDoor',options),
})

