# Friends Gallery Back-end

## Run app locally

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