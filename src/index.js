const db = require('./db');

if (require.main === module) {
	// Ejecución directa mínima para ver que funciona
	console.log('cotizador-crud starting (demo)');
	const demo = db.addClient({ name: 'Demo Cliente' });
	console.log('Added:', demo);
	console.log('All clients:', db.getClients());
}

module.exports = db;