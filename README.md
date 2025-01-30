crear archivo .env en la carpeta raiz del proyecto

nmp i para instalar las dependencias

npm run build para crear la carpeta build

- Instala un servidor web (por ejemplo, serve):

     sudo npm install -g serve

     - Inicia el servidor web para servir los archivos estáticos:

     serve -s build -l 3200

- Inicia el frontend con PM2:

     pm2 start "serve -s build -l 3200" --name "frontend"
    pm2 save
