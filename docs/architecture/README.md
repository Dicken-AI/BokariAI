# Architecture de Bokari

Bokari est une application Next.js qui combine un chat IA avec des capacites de recherche avancees.

Pour comprendre comment Bokari traite une requete de bout en bout, voir [WORKING.md](WORKING.md).

## Composants principaux

1. **Interface utilisateur** - Chat web avec citations et sources
2. **Routes API** - `POST /api/chat`, `POST /api/search`, `GET /api/providers`
3. **Agents et orchestration** - Classification, recherche et widgets en parallele
4. **Moteur de recherche** - TinyFish (principal) + SearXNG (fallback)
5. **LLMs** - Classification, generation de reponses, citations
6. **Modeles d'embedding** - Recherche semantique sur les fichiers uploades
7. **Stockage** - Supabase PostgreSQL pour chats et messages
