# Friends Gallery

![alt text](https://github.com/ErickOliveiraT/Friends-Gallery/blob/main/img/photos.PNG?raw=true)

## Deployment

- This application is online at: http://34.67.99.174:8080/

## Stack

- [Vue.js] - For Front-end
- [Flask] - For back-end (REST API)
- [AWS S3] - For storage
- [AWS Cognito] - For auth
- [AWS Amplify] - Helps integrate Vue.js with AWS Cognito and AWS S3
- [AWS EC2] - Back-end hosting
- [Firebase Cloud Firestore] - Database
- [GCP Compute Engine] - Front-end hosting

## Features

This application includes the following features:

- Upload photos
- Like photos
- Add comments to photos
- Approve or reject photos (only for admin user)

## Important

> Only the admin user (credentials provided via e-mail) can
> approve or reject uploaded photos. Furthermore, photos uploaded
> by this user do not need approval to be visible to everyone

## Architecture Model

![alt text](https://github.com/ErickOliveiraT/Friends-Gallery/blob/main/img/architeture.png?raw=true)

## Usage

### Uploading photos

![alt text](https://github.com/ErickOliveiraT/Friends-Gallery/blob/main/img/upload.PNG?raw=true)

Click on the upload button and select an image on file picker

### Liking photos

![alt text](https://github.com/ErickOliveiraT/Friends-Gallery/blob/main/img/like.PNG?raw=true)

If you have not liked a photo yet, the heart button will be white. You can click on it to like a photo.

If you already like a photo, the heart button will be red. You can click on it to unlike button.

The like counter is updated on every action.

### Commenting on photos

![alt text](https://github.com/ErickOliveiraT/Friends-Gallery/blob/main/img/comment.PNG?raw=true)

Use the text input to write your comment, then click on the publish button to submit your comment.

### Approve or reject photos

![alt text](https://github.com/ErickOliveiraT/Friends-Gallery/blob/main/img/approval.PNG?raw=true)

Click on the green button to approve a photo or on the red button to reject a photo.

![alt text](https://github.com/ErickOliveiraT/Friends-Gallery/blob/main/img/undo.PNG?raw=true)

If you rejected a photo, you still can change your mind and turn it online by clicking on the green button.

> Only the admin user (credentials provided via e-mail) can
> approve or reject uploaded photos. Furthermore, photos uploaded
> by this user do not need approval to be visible to everyone

## Run app locally

- Front-end:

In the root folder of the project:

```sh
cd friends-gallery
npm install
npm run serve
```

- Back-end:

In the root folder of the project:

```sh
cd backend/src
pip install -r requirements.txt
pip install pyopenssl
pip install testresources
python server.py
```
> Note: Edit the end of server.py file to alternate
> between HTTP and HTTPS protocols, or the server port.
> HTTPS protocol requires a SSL certificate. 
> It's currently set to HTTP.

[Vue.js]: <https://vuejs.org/>
[Flask]: <https://flask.palletsprojects.com/>
[AWS S3]: <https://aws.amazon.com/pt/s3/>
[AWS Cognito]: <https://aws.amazon.com/pt/cognito/>
[AWS EC2]: <https://aws.amazon.com/pt/ec2/>
[Firebase Cloud Firestore]: <https://firebase.google.com/products/firestore>
[GCP Compute Engine]: <https://cloud.google.com/compute>
[AWS Amplify]: <https://aws.amazon.com/en/amplify/>