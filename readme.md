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

## Architecture

![alt text](https://github.com/ErickOliveiraT/Friends-Gallery/blob/main/img/architeture.png?raw=true)

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

## Plugins

Dillinger is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.

| Plugin | README |
| ------ | ------ |
| Dropbox | [plugins/dropbox/README.md][PlDb] |
| GitHub | [plugins/github/README.md][PlGh] |
| Google Drive | [plugins/googledrive/README.md][PlGd] |
| OneDrive | [plugins/onedrive/README.md][PlOd] |
| Medium | [plugins/medium/README.md][PlMe] |
| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |

## Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantaneously see your updates!

Open your favorite Terminal and run these commands.

First Tab:

```sh
node app
```

Second Tab:

```sh
gulp watch
```

(optional) Third:

```sh
karma test
```

#### Building for source

For production release:

```sh
gulp build --prod
```

Generating pre-built zip archives for distribution:

```sh
gulp build dist --prod
```

## Docker

Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
cd dillinger
docker build -t <youruser>/dillinger:${package.json.version} .
```

This will create the dillinger image and pull in the necessary dependencies.
Be sure to swap out `${package.json.version}` with the actual
version of Dillinger.

Once done, run the Docker image and map the port to whatever you wish on
your host. In this example, we simply map port 8000 of the host to
port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 8000:8080 --restart=always --cap-add=SYS_ADMIN --name=dillinger <youruser>/dillinger:${package.json.version}
```

> Note: `--capt-add=SYS-ADMIN` is required for PDF rendering.

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:8000
```

## License

MIT

**Free Software, Oh Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[Vue.js]: <https://vuejs.org/>
[Flask]: <https://flask.palletsprojects.com/>
[AWS S3]: <https://aws.amazon.com/pt/s3/>
[AWS Cognito]: <https://aws.amazon.com/pt/cognito/>
[AWS EC2]: <https://aws.amazon.com/pt/ec2/>
[Firebase Cloud Firestore]: <https://firebase.google.com/products/firestore>
[GCP Compute Engine]: <https://cloud.google.com/compute>
[AWS Amplify]: <https://aws.amazon.com/en/amplify/>