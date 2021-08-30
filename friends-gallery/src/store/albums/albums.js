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
        //Upload a photo to AWS S3 and save it on database
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

            try {
                console.log('photo: ', JSON.stringify(photo))
                //Upload imagem to S3
                await Storage.put(key, file, {
                    level:'public',
                    contentType: mimeType,
                    metadata: { photoId }
                });

                //Call API to store image info on database
                let config = {
                    method: 'POST',
                    url: 'http://44.197.4.83/photos',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    },
                    data: JSON.stringify(photo)
                }   
                await axios(config);

                //Set extra photo fields to avoid a new database query
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

        //Call API to get photos from database
        async getPhotos(_, username) {
            let config = {
                method: 'GET',
                url: `http://44.197.4.83/photos?user=${username}`,
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

        //Call API to like or unlike a photo
        async processLike(_, data) {
            let {photo_id, username, action} = data;
            let config = {
                method: 'POST',
                url: `http://44.197.4.83/likes`,
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

        //Call API to approve or reject a photo (only admin)
        async processApproval(_, data) {
            let {photo_id, action} = data;
            let config = {
                method: 'POST',
                url: `http://44.197.4.83/approval`,
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

        //Call API to submit a new comment on a photo
        async submitComment(_, data) {
            let {photo_id, comment, username} = data;
            let config = {
                method: 'POST',
                url: `http://44.197.4.83/comments`,
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