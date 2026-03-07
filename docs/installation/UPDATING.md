# Mettre a jour Bokari

## Docker (images pre-construites)

```bash
docker pull dickenai/bokari:latest
docker stop bokari
docker rm bokari
docker run -d -p 3000:3000 -v bokari-data:/home/bokari/data --name bokari dickenai/bokari:latest
```

Version slim (sans SearXNG integre) :

```bash
docker pull dickenai/bokari:slim-latest
docker stop bokari
docker rm bokari
docker run -d -p 3000:3000 -e SEARXNG_API_URL=http://votre-searxng:8080 -v bokari-data:/home/bokari/data --name bokari dickenai/bokari:slim-latest
```

## Docker (build depuis les sources)

1. Allez dans le dossier Bokari et recuperez les derniers changements :

   ```bash
   cd Bokari
   git pull origin master
   ```

2. Reconstruisez l'image :

   ```bash
   docker build -t bokari .
   ```

3. Redemarrez le conteneur :

   ```bash
   docker stop bokari
   docker rm bokari
   docker run -p 3000:3000 -p 8080:8080 --name bokari bokari
   ```

## Sans Docker

1. Recuperez les derniers changements :

   ```bash
   cd Bokari
   git pull origin master
   ```

2. Installez les nouvelles dependances :

   ```bash
   npm i
   ```

3. Reconstruisez :

   ```bash
   npm run build
   ```

4. Redemarrez :

   ```bash
   npm run start
   ```

5. Verifiez sur http://localhost:3000. Vos parametres sont conserves automatiquement.
