crear archivo .env en la carpeta raiz del proyecto
REACT_APP_API_URL=http::3100
nmp i para instalar las dependencias

npm run build para crear la carpeta build

- Instala un servidor web (por ejemplo, serve):

     sudo npm install -g serve

     - Inicia el servidor web para servir los archivos estáticos:

     serve -s build -l 3200 (para probar)



- Inicia el frontend con PM2:

    crear 
    mkdir log
    cd log
    touch log.log
    chmod 777 log.log

    pm2 start "serve -s build -l 3200" --name "front_respirador" --log log/log.log --time
    pm2 save
