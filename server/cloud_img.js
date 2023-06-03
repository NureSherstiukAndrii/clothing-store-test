const { Storage } = require('@google-cloud/storage');
require("dotenv").config()

const storageConfig = {
    projectId: process.env.PROJECT_ID,
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    }
};

const storage = new Storage(storageConfig);


const bucketName = process.env.BUCKETNAME;

class Cloud_img{

    bucket = storage.bucket(bucketName);

    config = {
        action: 'read',
        expires: Date.now() + 180 * 60 * 100000 // дата истечения ссылки
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