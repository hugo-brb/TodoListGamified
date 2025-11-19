# 📝 API REST Gamifiée de Gestion de Tâches

## 📖 Description

Cette API REST implémente un système de gestion de tâches gamifié avec des fonctionnalités de progression (XP, niveaux), de badges, de défis quotidiens et de classement.

**Auteur:** Hugo BARBIERI

**Email:** hugo.barbieri@etu.univ-grenoble-alpes.fr

---

## 🎯 Spécification du Système

### Domaine Métier

Le système gère **5 entités principales** interconnectées :

#### 1. **User (Utilisateur)**

- Représente un utilisateur de l'application
- Attributs: username, email, password, xp, level, streak, longestStreak, lastLogin
- Relations: possède plusieurs tâches, peut obtenir des badges

#### 2. **Task (Tâche)**

- Représente une tâche à accomplir
- Attributs: title, description, category, done, points, deadline, completedAt
- Relations: appartient à un utilisateur

#### 3. **Badge**

- Représente une récompense débloquée
- Attributs: name, icon, description, condition
- Récompenses obtenues en fonction de critères (nombre de tâches, streak, etc.)

#### 4. **Challenge (Défi)**

- Représente un défi quotidien
- Attributs: title, description, points, date
- Défis renouvelés quotidiennement

#### 5. **Category (Catégorie)**

- Classification des tâches (sport, étude, travail, vie quotidienne, bien-être)

### Diagramme de Classes

Voir fichier TodoListGamified_Class-Diagram.pdf

### Mécaniques de Gamification

1. **Système d'XP et de Niveaux** - Chaque tâche complétée rapporte des points (10-40 XP)
2. **Système de Streak** - Compteur de jours consécutifs avec au moins une tâche complétée
3. **Badges** - Récompenses pour atteindre des objectifs
4. **Défis Quotidiens** - Objectifs renouvelés chaque jour avec bonus d'XP
5. **Leaderboard** - Classement des utilisateurs par XP

---

## 🚀 Installation et Exécution

### Prérequis

- **Docker** et **Docker Compose** (obligatoire)
- **Node.js** >= 18 et **npm** >= 9 (uniquement pour l'Option B - développement local)

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd todo-list-gamified-nest
```

### 2. Choisir votre mode d'exécution

Vous avez **deux options** pour lancer le projet :

---

## 🚀 Option A : Tout avec Docker (ULTRA-SIMPLE - RECOMMANDÉ)

**Avantages :**

- ✅ Pas besoin d'installer Node.js
- ✅ Pas besoin de `npm install`
- ✅ MongoDB + Application démarrent ensemble
- ✅ Base de données remplie automatiquement

**UNE SEULE COMMANDE suffit !**

```bash
docker-compose up -d
```

✅ L'application est accessible sur <http://localhost:3000>
✅ La documentation Swagger est sur <http://localhost:3000/api>
✅ La base de données se remplit automatiquement avec les données de test

**Commandes utiles :**

```bash

# Voir les logs en temps réel

docker-compose logs -f app

# Arrêter tout

docker-compose down

# Nettoyer complètement (supprime les données)

docker-compose down -v

# Reconstruire après modifications du code

docker-compose up -d --build
```

---

## 🔧 Option B : Développement local (pour coder)

**Avantages :** Hot-reload, débogage facile, logs directs

### 2.1 Installer les dépendances

```bash
npm install
```

### 2.2 Configuration

Copier et modifier le fichier `.env` :

```bash
cp .env.example .env
```

**Important :** Modifier `.env` pour utiliser `localhost` :

```env
NODE_ENV=development
PORT=3000

# MongoDB (localhost pour développement local)

MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=example
MONGO_INITDB_DATABASE=todo

# Auto-seed: remplir la base automatiquement au démarrage

AUTO_SEED=true
```

### 2.3 Lancer MongoDB seul

```bash
docker-compose up -d mongo
```

### 2.4 Lancer l'application en mode développement

```bash

# Mode développement (avec auto-reload)

npm run start:dev

# Ou mode production

npm run build
npm run start:prod
```

✅ L'application démarre sur <http://localhost:3000> (redirige vers /api)
✅ Documentation Swagger sur <http://localhost:3000/api>

---

## 🧪 Test Rapide de l'API

### Via Swagger (Interface Web)

Ouvrir <http://localhost:3000/api>

### Via Curl

```bash
# Se connecter
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@todo.com","password":"password123"}'

# Lister les tâches
curl http://localhost:3000/api/tasks

# Voir le leaderboard
curl http://localhost:3000/api/leaderboard
```

---

## 📊 Jeu de Données de Test

### Seed Automatique

Lorsque `AUTO_SEED=true` dans le fichier `.env`, la base de données est **automatiquement remplie** au démarrage avec des données de test si elle est vide.

### Données incluses dans le seed

#### 👥 5 Utilisateurs

| Username | Email               | Password    | XP   | Level | Streak |
| -------- | ------------------- | ----------- | ---- | ----- | ------ |
| admin    | admin@todo.com      | password123 | 1250 | 5     | 15     |
| alice    | alice@example.com   | password123 | 850  | 4     | 7      |
| bob      | bob@example.com     | password123 | 450  | 3     | 3      |
| charlie  | charlie@example.com | password123 | 200  | 2     | 1      |
| diana    | diana@example.com   | password123 | 50   | 1     | 0      |

#### 📋 16 Tâches

- Tâches complétées et non complétées
- Différentes catégories : sport, étude, travail, vie quotidienne, bien-être
- Réparties entre les utilisateurs

#### 🏅 6 Badges

- Premier pas (1ère tâche)
- Productif (10 tâches)
- Marathonien (streak de 7 jours)
- Expert (niveau 5)
- Organisateur (5 catégories)
- Défi Maître (5 défis)

#### 🎯 5 Challenges

- Défis quotidiens avec différents objectifs
- Points bonus variables (30-75 XP)

### Commandes de Seed Manuel

Si vous souhaitez re-remplir la base manuellement :

```bash

# Remplir la base (ne fait rien si elle contient déjà des données)

npm run seed

# Nettoyer ET remplir la base

npm run seed:clear
```

### Connexion avec les Utilisateurs de Test

Vous pouvez vous connecter avec n'importe quel utilisateur du seed :

**POST** `/api/auth/login`

```json
{
  "email": "admin@todo.com",
  "password": "password123"
}
```

Le token retourné peut ensuite être utilisé dans les headers :

```http
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📡 Routes API Implémentées

Toutes les routes de la spécification OpenAPI (`specifications.yaml`) sont implémentées :

### �� Authentification

- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

### 👤 Utilisateurs

- `GET /api/users` - Liste des utilisateurs (admin)
- `GET /api/users/me` - Profil utilisateur connecté
- `PUT /api/users/me` - Mettre à jour son profil
- `GET /api/users/:id` - Récupérer un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur (admin)
- `GET /api/users/:id/progress` - Progression d'un utilisateur

### ✅ Tâches

- `GET /api/tasks` - Liste des tâches (avec filtres: limit, offset, category)
- `POST /api/tasks` - Créer une tâche
- `PUT /api/tasks/:id` - Mettre à jour une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche
- `PATCH /api/tasks/:id/complete` - Marquer comme complétée (ajout XP)

### 🏅 Badges

- `GET /api/badges` - Liste des badges obtenus

### 🎯 Challenges

- `GET /api/challenges` - Liste des challenges
- `GET /api/challenges/today` - Défi du jour
- `POST /api/challenges/:id/complete` - Compléter un défi

### 🏆 Leaderboard

- `GET /api/leaderboard` - Classement global (avec limit, offset)

### 📂 Categories

- `GET /api/categories` - Liste des catégories disponibles

---

## 🧪 Tester l'API avec le REST Client

Un fichier `api.http` est disponible à la racine du projet pour tester facilement tous les endpoints de l'API.

### Utilisation avec VS Code

1. **Installer l'extension REST Client** (humao.rest-client) si ce n'est pas déjà fait
2. **Ouvrir le fichier** `api.http`
3. **Lancer l'application** (voir section Installation)
4. **Cliquer sur "Send Request"** au-dessus de chaque requête

### Workflow typique

1. **Se connecter** avec un utilisateur de test :

   ```http
   POST {{baseUrl}}/auth/login
   Content-Type: application/json

   {
     "email": "admin@todo.com",
     "password": "password123"
   }
   ```

2. **Copier le token JWT** retourné dans la réponse

3. **Remplacer** `@token = your_jwt_token_here` en haut du fichier `api.http` par le token obtenu

4. **Tester les autres endpoints** qui nécessitent une authentification

### Utilisateurs disponibles (avec seed)

- `admin@todo.com` / `password123` (admin, niveau 5, 1250 XP)
- `alice@example.com` / `password123` (niveau 4, 850 XP)
- `bob@example.com` / `password123` (niveau 3, 450 XP)
- `charlie@example.com` / `password123` (niveau 2, 200 XP)
- `diana@example.com` / `password123` (niveau 1, 50 XP)

### Exemples de requêtes disponibles

- 🔐 **Authentification** : Register, Login
- 👤 **Utilisateurs** : Profil, Mise à jour, Liste (admin), Progression
- ✅ **Tâches** : Liste (avec filtres), Création, Mise à jour, Complétion, Suppression
- 🏅 **Badges** : Liste des badges obtenus
- 🎯 **Challenges** : Liste, Défi du jour, Complétion
- 🏆 **Leaderboard** : Classement global (avec pagination)
- 📂 **Categories** : Liste des catégories

**Alternative** : Vous pouvez également utiliser **Postman**, **Insomnia**, ou directement la **documentation Swagger** sur http://localhost:3000/api

---

## 🛠️ Méthodologie de Développement

### Approche Hybrid: Spécification → Code

**1. Spécification OpenAPI d'abord**

- J'ai commencé par définir le fichier `specifications.yaml` complet
- Cela m'a permis de clarifier les endpoints nécessaires, définir les modèles de données et valider la cohérence de l'API avant l'implémentation

**2. Développement du serveur NestJS**

- Création des schemas MongoDB (User, Task, Badge, Challenge)
- Implémentation des controllers conformes à la spec OpenAPI
- Ajout de la validation avec class-validator
- Documentation automatique avec @nestjs/swagger

### Choix Techniques

- **NestJS** : Framework structuré, architecture modulaire, injection de dépendances
- **MongoDB + Mongoose** : Base NoSQL flexible pour l'évolution du schéma
- **Argon2** : Hashing sécurisé des mots de passe
- **Swagger/OpenAPI** : Documentation interactive automatique
- **Docker Compose** : Déploiement simplifié de MongoDB

### Conformité REST et HATEOAS

L'API suit les principes REST :

- Ressources identifiées par URI (`/users/:id`, `/tasks/:id`)
- Méthodes HTTP sémantiques (GET, POST, PUT, DELETE, PATCH)
- Codes de statut HTTP appropriés (200, 201, 204, 400, 401, 403, 404)
- Stateless : pas de session côté serveur

**HATEOAS (Hypermedia As The Engine Of Application State)** : ✅ **Implémenté**

Toutes les réponses de l'API incluent des liens `_links` permettant la navigation hypermedia. Chaque réponse est structurée ainsi :

```json
{
  "data": {
    /* ... données de la ressource ... */
  },
  "_links": [
    { "rel": "self", "href": "/api/resource/123", "method": "GET" },
    { "rel": "update", "href": "/api/resource/123", "method": "PUT" },
    { "rel": "delete", "href": "/api/resource/123", "method": "DELETE" }
  ]
}
```

**Exemples de liens HATEOAS :**

- **Tâches** : liens vers `self`, `update`, `delete`, `complete`, `list`
- **Utilisateurs** : liens vers `self`, `progress`, `update`, `tasks`, `badges`, `challenges`
- **Challenges** : liens vers `self`, `complete`, `list`, `today`
- **Badges** : liens vers `self`, `profile`
- **Leaderboard** : liens vers `self`, `profile`
- **Authentification** : liens vers `login`, `register`, `profile`

Cela permet aux clients de découvrir dynamiquement les actions possibles sans connaître à l'avance la structure de l'API.

#### Exemple concret de réponse HATEOAS

**Requête :** `GET /api/tasks`

**Réponse :**

```json
{
  "data": [
    {
      "_id": "673ec7d47f6e8b4a2f1c3d4e",
      "userId": "000000000000000000000001",
      "title": "Faire du jogging",
      "description": "Course de 5km dans le parc",
      "category": "sport",
      "done": false,
      "deadline": "2025-11-25T18:00:00.000Z",
      "createdAt": "2024-11-21T10:30:00.000Z"
    }
  ],
  "_links": [
    { "rel": "self", "href": "/api/tasks", "method": "GET" },
    { "rel": "create", "href": "/api/tasks", "method": "POST" }
  ]
}
```

Le client peut maintenant voir qu'il peut créer une nouvelle tâche via `POST /api/tasks` sans avoir besoin de consulter la documentation.

---

## 📦 Structure du Projet

```
.
├── api.http # REST Client pour tester l'API
├── docker-compose.yml # Configuration Docker
├── docker-compose.dev.yml # Configuration Docker développement
├── Dockerfile # Image Docker production
├── Dockerfile.dev # Image Docker développement
├── package.json
├── README.md
├── specifications.yaml # Spécification OpenAPI complète
└── src/
├── auth/ # Module d'authentification
├── users/ # Module utilisateurs
├── tasks/ # Module tâches
├── badges/ # Module badges
├── challenges/ # Module défis
├── leaderboard/ # Module classement
├── categories/ # Module catégories
├── database/ # Configuration MongoDB + Seed
│ ├── database.module.ts
│ └── seed.service.ts
├── schemas/ # Schémas Mongoose
│ ├── user.schema.ts
│ ├── task.schema.ts
│ ├── badge.schema.ts
│ └── challenge.schema.ts
├── common/ # Guards et utilitaires
│ ├── admin.guard.ts
│ └── hateoas.helper.ts
├── app.controller.ts # Controller racine (redirection)
├── app.module.ts # Module racine
├── main.ts # Point d'entrée
└── seed.ts # Script de seed manuel
```

---

## 🔒 Sécurité

- Mots de passe hashés avec **Argon2** (standard moderne, résistant aux attaques GPU)
- Validation des données d'entrée avec **class-validator**
- Guards NestJS pour protéger les routes sensibles
- Variables d'environnement pour les secrets

---

## 🐳 Déploiement avec Docker

Le projet inclut un `docker-compose.yml` pour MongoDB :

```yaml
services:
mongo:
image: mongo:6.0
container_name: todo_mongo
restart: unless-stopped
environment:
MONGO_INITDB_ROOT_USERNAME: root
MONGO_INITDB_ROOT_PASSWORD: example
MONGO_INITDB_DATABASE: todo
ports: - "27017:27017"
volumes: - mongo-data:/data/db
```

### Commandes Docker

```bash

# Démarrer MongoDB

docker-compose up -d

# Voir les logs

docker-compose logs -f

# Arrêter

docker-compose down

# Nettoyer complètement (supprime les données)

docker-compose down -v
```

---

## ❌ Dépannage

### Le port 27017 est déjà utilisé

```bash
docker-compose down
docker-compose up -d
```

### La base de données est vide

Vérifier que `AUTO_SEED=true` dans `.env`, puis redémarrer :

```bash
npm run start:dev
```

Ou utiliser le seed manuel :

```bash
npm run seed:clear
```

### L'application ne démarre pas avec Docker

Vérifier les logs :

```bash
docker-compose logs -f app
```

Reconstruire l'image :

```bash
docker-compose down
docker-compose up -d --build
```

---

## 📄 Licence

Ce projet est développé dans un cadre pédagogique (IUT - R5.08).

---
