# Comment contribuer a Bokari

Merci de ton interet pour contribuer a Bokari. Ce guide explique comment participer au projet.

## Structure du projet

Bokari est une application Next.js avec les dossiers principaux suivants :

- `src/app/` - Pages et routes API (App Router)
- `src/components/` - Composants React (chat, sidebar, settings, etc.)
- `src/lib/` - Logique metier
  - `src/lib/agents/` - Agents de recherche, media, etc.
  - `src/lib/config/` - Gestion de la configuration
  - `src/lib/db/` - Base de donnees (Supabase)
  - `src/lib/hooks/` - Hooks React personnalises
  - `src/lib/models/` - Providers de modeles LLM
  - `src/lib/prompts/` - Prompts systeme
  - `src/lib/supabase/` - Client et utilitaires Supabase
  - `src/lib/search.ts` - Backend de recherche (TinyFish)
  - `src/lib/searxng.ts` - Integration SearXNG (fallback)

## Comment contribuer

1. Fork le projet
2. Cree une branche pour ta feature (`git checkout -b feature/ma-feature`)
3. Fais tes modifications
4. Teste localement (`npm run dev`)
5. Commit tes changements (`git commit -m "feat: description"`)
6. Push ta branche (`git push origin feature/ma-feature`)
7. Ouvre une Pull Request

## Conventions

- **Commits** : utilise les [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
- **Style** : le projet utilise Prettier pour le formatage (`npm run format:write`)
- **Langue** : l'interface est en francais, le code et les commentaires en anglais
- **Tests** : verifie que le build passe avant de soumettre (`npm run build`)

## Signaler un bug

Ouvre une issue sur GitHub avec :
- Une description claire du probleme
- Les etapes pour reproduire
- Le comportement attendu vs observe
- Ta configuration (OS, navigateur, version de Node)

## Attribution

En contribuant, tu acceptes que tes contributions soient soumises aux termes de la licence du projet. Le projet reste sous la propriete de Ousmane Dicko / Dicken AI.
