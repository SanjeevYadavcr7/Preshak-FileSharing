const File = require('./models/file');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();


async function deleteData(){
    const pastDate = new Date(Date.now() - 24*60*60*1000);    // creating past date of 24 hours
    const files = await File.find({ createdAt: {$lt: pastDate} });
    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path);
                await file.remove();      
                console.log(`${file.filename} has been deleted`);
            }catch(err){
                console.log(`Error while deleting file : ${err}`);
            }
        }
        console.log('File deleted after 24 hrs');
    } 
}

deleteData().then(process.exit);