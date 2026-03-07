# Comment fonctionne Bokari

Vue d'ensemble du traitement d'une question par Bokari.

## Que se passe-t-il quand vous posez une question

Quand vous envoyez un message, l'app appelle `POST /api/chat`.

A haut niveau, trois etapes :

1. Classifier la question et decider quoi faire
2. Lancer la recherche et les widgets en parallele
3. Rediger la reponse finale avec citations

## Classification

Avant toute recherche, une etape de classification decide :

- Si une recherche est necessaire
- Quels widgets afficher
- Comment reformuler la question

## Widgets

Les widgets sont des helpers structures (meteo, cours boursiers, calculs) qui tournent en parallele avec la recherche.

## Recherche

Si necessaire, le Researcher Agent lance des recherches via TinyFish ou SearXNG, extrait le contenu des pages, et compile les sources.

## Modes d'optimisation

- `speed` - Reponse rapide, ~5-10 sources
- `balanced` - Equilibre vitesse/precision, ~15-20 sources
- `quality` - Investigation complete, 30-100 sources

## Citations

Le modele cite les references utilisees. L'interface affiche ces citations avec les liens vers les sources.

## API Search

Pour integrer Bokari dans un autre produit : `POST /api/search`.

Retourne :
- `message` : la reponse generee
- `sources` : les references utilisees

Streaming disponible avec `stream: true`.
