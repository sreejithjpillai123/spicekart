const mongoose = require('mongoose');

async function test() {
    try {
        console.log('Trying no auth...');
        const conn1 = await mongoose.connect('mongodb://127.0.0.1:27017/admin');
        console.log('Connected without auth!');

        // Let's create the user for them
        const adminDb = conn1.connection.db;
        try {
            await adminDb.command({
                createUser: "spices",
                pwd: "spices123",
                roles: [{ role: "userAdminAnyDatabase", db: "admin" }, { "role": "root", "db": "admin" }]
            });
            console.log("Created user 'spices' in admin DB");
        } catch (e) {
            console.log("Could not create in admin (maybe exists): " + e.message);
        }

        const spicekartDb = conn1.connection.client.db('spicekart');
        try {
            await spicekartDb.command({
                createUser: "spices",
                pwd: "spices123",
                roles: [{ role: "readWrite", db: "spicekart" }]
            });
            console.log("Created user 'spices' in spicekart DB");
        } catch (e) {
            console.log("Could not create in spicekart (maybe exists): " + e.message);
        }
        process.exit(0);
    } catch (e) {
        console.log('Failed no auth: ' + e.message);
        process.exit(1);
    }
}
test();
