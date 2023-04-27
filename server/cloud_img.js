const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: 'dogwood-garden-382315',
    keyFilename: './dogwood-garden-382315-f58b3243e2e9.json',
});

const bucketName = 'nure_bucket';


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