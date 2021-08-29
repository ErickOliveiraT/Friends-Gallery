import { Storage } from "aws-amplify";
import { v4 } from "uuid";
import awsconfig from "@/aws-exports";
import axios from 'axios';

export const albumInfo = {
    namespaced: true,
    state: { photos: [] },
    mutations: {

    },
    actions: {
        async createPhoto(_, data) {
            const {
                aws_user_files_s3_bucket_region: region,
                aws_user_files_s3_bucket: bucket
            } = awsconfig;
            let { file, type: mimeType, username } = data;
            const extension = file.name.substr(file.name.lastIndexOf(".") + 1);
            if (extension.toLowerCase() == 'png') mimeType = 'image/png';
            else mimeType = 'image/jpeg'
            const photoId = v4();
            const key = `images/${photoId}.${extension}`;
            const photo = {
                id: photoId,
                contentType: mimeType,
                fullsize: {
                    key,
                    region,
                    bucket
                },
                uploaded_by: username
            }

            //s3 bucket storage add file to it
            try {
                console.log('photo: ', JSON.stringify(photo))
                await Storage.put(key, file, {
                    level:'public',
                    contentType: mimeType,
                    metadata: { photoId }
                });

                let config = {
                    method: 'POST',
                    url: 'http://localhost:3000/photos',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    },
                    data: JSON.stringify(photo)
                }   
                await axios(config);
                
                return Promise.resolve(photo)
            } catch (error) {
                console.log("createPhoto error", error)
                return Promise.reject(error);
            }
        },

        async getPhotos(_, username) {
            let config = {
                method: 'GET',
                url: `http://localhost:3000/photos?user=${username}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }   

            try {
                //console.log('request sent: ', config);
                let response = await axios(config);
                return Promise.resolve(response.data);
            }
            catch (error) {
                console.log("createPhoto error", error)
                return Promise.reject(error);
            }
        }
    }
}