require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('🟢 Connected to Vault. Hunting down old database ghosts...');
        
        try {
            // This drops the entire Users collection, wiping out the old phone rules!
            await mongoose.connection.collection('users').drop();
            console.log('🧹 BOOM! Old Users Vault wiped clean!');
        } catch (err) {
            console.log('👍 Vault is already clean.');
        }

        console.log('🔥 You are now ready for Google Auth! You can close this script.');
        process.exit(0);
    })
    .catch(err => {
        console.error('🔴 Connection Failed:', err);
    });