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
                    url: 'http://3.86.81.188/photos',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    },
                    data: JSON.stringify(photo)
                }   
                await axios(config);

                photo.status = username == 'admin' ? 'approved' : 'pending';
                photo.liked_by_user = false;
                photo.likes_count = 0;
                photo.comments = new Array();

                return Promise.resolve(photo)
            } catch (error) {
                console.log("createPhoto error", error)
                return Promise.reject(error);
            }
        },

        async getPhotos(_, username) {
            let config = {
                method: 'GET',
                url: `http://3.86.81.188/photos?user=${username}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }   

            try {
                let response = await axios(config);
                return Promise.resolve(response.data);
            }
            catch (error) {
                console.log("createPhoto error", error)
                return Promise.reject(error);
            }
        },

        async processLike(_, data) {
            let {photo_id, username, action} = data;
            let config = {
                method: 'POST',
                url: `http://3.86.81.188/likes`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    photo_id: photo_id,
                    user: username,
                    action: action
                })
            }   

            try {
                let response = await axios(config);
                return Promise.resolve(response.data);
            }
            catch (error) {
                console.log("processLike error", error)
                return Promise.reject(error);
            }
        },

        async processApproval(_, data) {
            let {photo_id, action} = data;
            let config = {
                method: 'POST',
                url: `http://3.86.81.188/approval`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    photo_id: photo_id,
                    action: action
                })
            }   

            try {
                let response = await axios(config);
                return Promise.resolve(response.data);
            }
            catch (error) {
                console.log("processApproval error", error)
                return Promise.reject(error);
            }
        },

        async submitComment(_, data) {
            let {photo_id, comment, username} = data;
            let config = {
                method: 'POST',
                url: `http://3.86.81.188/comments`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    photo_id: photo_id,
                    text: comment,
                    user: username
                })
            }   

            try {
                let response = await axios(config);
                return Promise.resolve(response.data);
            }
            catch (error) {
                console.log("submitComment error", error)
                return Promise.reject(error);
            }
        }
    }
}