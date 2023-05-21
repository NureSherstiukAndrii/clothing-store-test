const { Storage } = require('@google-cloud/storage');
require('dotenv').config();
const storage = new Storage({
    projectId: process.env.project_id, 
    keyFilename: process.env.keyFilename,
});

const bucketName = process.env.bucketName;


async function getFilesFromStorage() {
    try {
        const [files] = await storage.bucket(bucketName).getFiles();
        console.log('files', files);
        return files;
    } catch (err) {
        console.error('ERROR:', err);
    }
}

class Cloud_img{

    bucket = storage.bucket(bucketName);

    config = {
        action: 'read',
        expires: Date.now() + 180 * 60 * 1000 // дата истечения ссылки
    };


    async getImgUrl(filename){
        const file = this.bucket.file(filename);
        return new Promise((resolve, reject) => {
            file.getSignedUrl(this.config, function (err, url) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(url);
                }
            });
        });
    }

}

module.exports = Cloud_img;