import { Storage } from "aws-amplify";
import { v4 } from "uuid";
import awsconfig from "@/aws-exports";

export const albumInfo = {
    namespaced: true,
    state: { photos: [] },
    mutations: {
        incPhotos(state, payload) {
            state.photos.push(payload);
        }
    },
    actions: {
        
        async createPhoto({commit}, data) {
            const {
                aws_user_files_s3_bucket_region: region,
                aws_user_files_s3_bucket: bucket
            } = awsconfig;
            let { file, type: mimeType } = data;
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
                uploaded_by: ''
            }

            //s3 bucket storage add file to it
            try {
                console.log('photo: ', JSON.stringify(photo))
                await Storage.put(key, file, {
                    level:'protected',
                    contentType: mimeType,
                    metadata: { photoId }
                });
                
                commit('incPhotos',photo)
                return Promise.resolve(photo)
            } catch (error) {
                console.log("createPhoto error", error)
                return Promise.reject(error);

            }
        },

    },

    getters: {
        photos: (state) => state.photos
    }
}