# Bokari Search API Documentation

## Overview

L'API de recherche de Bokari permet d'integrer le moteur de recherche IA dans vos applications. Vous pouvez lancer des recherches, choisir vos modeles et obtenir des reponses sourcees.

## Endpoints

### Obtenir les providers disponibles

#### **GET** `/api/providers`

**URL** : `http://localhost:3000/api/providers`

Retourne la liste des providers actifs avec leurs modeles.

**Exemple de reponse :**

```json
{
  "providers": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "OpenAI",
      "chatModels": [
        { "name": "GPT 4 Omni Mini", "key": "gpt-4o-mini" },
        { "name": "GPT 4 Omni", "key": "gpt-4o" }
      ],
      "embeddingModels": [
        { "name": "Text Embedding 3 Large", "key": "text-embedding-3-large" }
      ]
    }
  ]
}
```

### Lancer une recherche

#### **POST** `/api/search`

**URL** : `http://localhost:3000/api/search`

**Note** : Remplacez `localhost:3000` par l'URL de votre instance Bokari si necessaire.

### Corps de la requete

```json
{
  "chatModel": {
    "providerId": "550e8400-e29b-41d4-a716-446655440000",
    "key": "gpt-4o-mini"
  },
  "embeddingModel": {
    "providerId": "550e8400-e29b-41d4-a716-446655440000",
    "key": "text-embedding-3-large"
  },
  "optimizationMode": "speed",
  "sources": ["web"],
  "query": "Quelles sont les dernieres nouvelles en Afrique de l'Ouest ?",
  "history": [
    ["human", "Bonjour"],
    ["assistant", "Bonjour, comment puis-je vous aider ?"]
  ],
  "systemInstructions": "Repondre en francais avec des sources fiables.",
  "stream": false
}
```

### Parametres

- **`chatModel`** (object, requis) : Modele de chat a utiliser.
  - `providerId` (string) : UUID du provider (depuis `/api/providers`)
  - `key` (string) : Cle du modele (ex: `gpt-4o-mini`)

- **`embeddingModel`** (object, requis) : Modele d'embedding pour la recherche semantique.
  - `providerId` (string) : UUID du provider
  - `key` (string) : Cle du modele (ex: `text-embedding-3-large`)

- **`sources`** (array, requis) : Sources de recherche. Valeurs : `web`, `academic`, `discussions`

- **`optimizationMode`** (string, optionnel) : `speed`, `balanced`, ou `quality`

- **`query`** (string, requis) : La question de recherche

- **`systemInstructions`** (string, optionnel) : Instructions personnalisees pour guider la reponse

- **`history`** (array, optionnel) : Historique de conversation pour le contexte

- **`stream`** (boolean, optionnel) : Active le streaming SSE. Par defaut : `false`

### Reponse standard (stream: false)

```json
{
  "message": "Voici les dernieres nouvelles...",
  "sources": [
    {
      "content": "Extrait du contenu source...",
      "metadata": {
        "title": "Titre de la page",
        "url": "https://example.com/article"
      }
    }
  ]
}
```

### Reponse streaming (stream: true)

Retourne un flux SSE (`Content-Type: text/event-stream`) :

```
{"type":"init","data":"Stream connected"}
{"type":"sources","data":[...]}
{"type":"response","data":"Bokari est "}
{"type":"response","data":"un moteur de recherche..."}
{"type":"done"}
```

Types de messages :
- **`init`** : Connexion etablie
- **`sources`** : Sources utilisees
- **`response`** : Fragments de la reponse
- **`done`** : Fin du stream

### Codes d'erreur

- **400** : Requete mal formee ou champs manquants
- **500** : Erreur interne du serveur
