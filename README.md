# 📝 API REST Gamifiée de Gestion de Tâches

## 📖 Description

Cette API REST implémente un système de gestion de tâches gamifié avec des fonctionnalités de progression (XP, niveaux), de badges, de défis quotidiens et de classement. Le projet a été développé avec **NestJS** et **MongoDB** dans le cadre du module R5.08 - Services web.

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

### Diagramme de Classes (simplifié)

\`\`\`
┌─────────────┐ 1 \* ┌──────────────┐
│ User │◄─────────────────────┤ Task │
├─────────────┤ ├──────────────┤
│ username │ │ title │
│ email │ │ description │
│ xp │ │ category │
│ level │ │ done │
│ streak │ │ points │
└─────────────┘ └──────────────┘
│
│ obtient
│
▼
┌─────────────┐ ┌──────────────┐
│ Badge │ │ Challenge │
├─────────────┤ ├──────────────┤
│ name │ │ title │
│ icon │ │ description │
│ description │ │ points │
│ condition │ │ date │
└─────────────┘ └──────────────┘
\`\`\`

### Mécaniques de Gamification

1. **Système d'XP et de Niveaux** - Chaque tâche complétée rapporte des points (10-40 XP)
2. **Système de Streak** - Compteur de jours consécutifs avec au moins une tâche complétée
3. **Badges** - Récompenses pour atteindre des objectifs
4. **Défis Quotidiens** - Objectifs renouvelés chaque jour avec bonus d'XP
5. **Leaderboard** - Classement des utilisateurs par XP

---

## 🚀 Installation et Exécution

### Prérequis

- **Node.js** >= 18
- **npm** >= 9
- **Docker** et **Docker Compose** (pour MongoDB)

### 1. Cloner le dépôt

\`\`\`bash
git clone <url-du-repo>
cd todo-list-gamified-nest
\`\`\`

### 2. Choisir votre mode d'exécution

Vous avez **deux options** pour lancer le projet :

---

## 🚀 Option A : Tout avec Docker (RECOMMANDÉ pour les correcteurs)

**Avantage :** Ultra-simple, aucune installation Node.js nécessaire sur la machine hôte

\`\`\`bash

# Lancer MongoDB + Application en un seul coup

docker-compose up -d

# Voir les logs en temps réel (optionnel)

docker-compose logs -f app
\`\`\`

✅ L'application démarre automatiquement sur **http://localhost:3000**  
✅ La base de données se remplit automatiquement avec les données de test  
✅ Documentation Swagger accessible sur **http://localhost:3000/api**

**Commandes utiles :**
\`\`\`bash

# Arrêter tout

docker-compose down

# Nettoyer complètement (supprime les données)

docker-compose down -v

# Reconstruire après modifications du code

docker-compose up -d --build
\`\`\`

---

## 🔧 Option B : Développement local (pour coder)

**Avantage :** Hot-reload, débogage facile, logs directs

#### 2.1 Installer les dépendances

\`\`\`bash
npm install
\`\`\`

#### 2.2 Configuration

Copier et modifier le fichier \`.env\` :

\`\`\`bash
cp .env.example .env
\`\`\`

**Important :** Modifier \`.env\` pour utiliser \`localhost\` :
\`\`\`env
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
\`\`\`

#### 2.3 Lancer MongoDB seul

\`\`\`bash
docker-compose up -d mongo
\`\`\`

#### 2.4 Lancer l'application en mode développement

\`\`\`bash

# Mode développement (avec auto-reload)

npm run start:dev

# Ou mode production

npm run build
npm run start:prod
\`\`\`

✅ L'application démarre sur **http://localhost:3000**  
✅ Documentation Swagger sur **http://localhost:3000/api**

---

## 📊 Jeu de Données de Test

### Seed Automatique

Lorsque \`AUTO_SEED=true\` dans le fichier \`.env\`, la base de données est **automatiquement remplie** au démarrage avec des données de test si elle est vide.

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

\`\`\`bash

# Remplir la base (ne fait rien si elle contient déjà des données)

npm run seed

# Nettoyer ET remplir la base

npm run seed:clear
\`\`\`

### Test de l'API avec les données de seed

Vous pouvez vous connecter avec n'importe quel utilisateur du seed :

**POST** \`/api/auth/login\`
\`\`\`json
{
"email": "admin@todo.com",
"password": "password123"
}
\`\`\`

Le token retourné peut ensuite être utilisé dans les headers :
\`\`\`
Authorization: Bearer <token>
\`\`\`

---

## 📡 Routes API Implémentées

Toutes les routes de la spécification OpenAPI (\`specifications.yaml\`) sont implémentées :

### �� Authentification

- \`POST /api/auth/register\` - Créer un compte
- \`POST /api/auth/login\` - Se connecter

### 👤 Utilisateurs

- \`GET /api/users\` - Liste des utilisateurs (admin)
- \`GET /api/users/me\` - Profil utilisateur connecté
- \`PUT /api/users/me\` - Mettre à jour son profil
- \`GET /api/users/:id\` - Récupérer un utilisateur
- \`DELETE /api/users/:id\` - Supprimer un utilisateur (admin)
- \`GET /api/users/:id/progress\` - Progression d'un utilisateur

### ✅ Tâches

- \`GET /api/tasks\` - Liste des tâches (avec filtres: limit, offset, category)
- \`POST /api/tasks\` - Créer une tâche
- \`PUT /api/tasks/:id\` - Mettre à jour une tâche
- \`DELETE /api/tasks/:id\` - Supprimer une tâche
- \`PATCH /api/tasks/:id/complete\` - Marquer comme complétée (ajout XP)

### 🏅 Badges

- \`GET /api/badges\` - Liste des badges obtenus

### 🎯 Challenges

- \`GET /api/challenges\` - Liste des challenges
- \`GET /api/challenges/today\` - Défi du jour
- \`POST /api/challenges/:id/complete\` - Compléter un défi

### 🏆 Leaderboard

- \`GET /api/leaderboard\` - Classement global (avec limit, offset)

### 📂 Categories

- \`GET /api/categories\` - Liste des catégories disponibles

---

## 🛠️ Méthodologie de Développement

### Approche Hybrid: Spécification → Code

**1. Spécification OpenAPI d'abord**

- J'ai commencé par définir le fichier \`specifications.yaml\` complet
- Cela m'a permis de clarifier les endpoints nécessaires, définir les modèles de données et valider la cohérence de l'API avant l'implémentation

**2. Développement du serveur NestJS**

- Création des schemas MongoDB (User, Task, Badge, Challenge)
- Implémentation des controllers conformes à la spec OpenAPI
- Ajout de la validation avec class-validator
- Documentation automatique avec @nestjs/swagger

**3. Pourquoi cette approche ?**

✅ **Avantages**

- **Design-first** : conception réfléchie de l'API avant le code
- **Documentation toujours à jour** : la spec sert de référence
- **Clarté** : contrat API défini dès le départ
- **Collaboration** : facilite le travail en équipe (frontend/backend)

❌ **Inconvénients potentiels**

- Modifications nécessitent de synchroniser spec et code
- Peut sembler plus lent au début

### Choix Techniques

- **NestJS** : Framework structuré, architecture modulaire, injection de dépendances
- **MongoDB + Mongoose** : Base NoSQL flexible pour l'évolution du schéma
- **Argon2** : Hashing sécurisé des mots de passe
- **Swagger/OpenAPI** : Documentation interactive automatique
- **Docker Compose** : Déploiement simplifié de MongoDB

### Conformité REST et HATEOAS

L'API suit les principes REST :

- Ressources identifiées par URI (\`/users/:id\`, \`/tasks/:id\`)
- Méthodes HTTP sémantiques (GET, POST, PUT, DELETE, PATCH)
- Codes de statut HTTP appropriés (200, 201, 204, 400, 401, 403, 404)
- Stateless : pas de session côté serveur

**Note sur HATEOAS** : L'implémentation actuelle ne propose pas de liens HATEOAS complets dans les réponses. Cela pourrait être ajouté en bonus en incluant des liens \`\_links\` dans les réponses JSON.

---

## 🧪 Tests

### Tests unitaires

\`\`\`bash
npm run test
\`\`\`

### Tests end-to-end

\`\`\`bash
npm run test:e2e
\`\`\`

### Coverage

\`\`\`bash
npm run test:cov
\`\`\`

---

## 📦 Structure du Projet

\`\`\`
src/
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
│ └── mock-auth.guard.ts
├── app.module.ts # Module racine
├── main.ts # Point d'entrée
└── seed.ts # Script de seed manuel
\`\`\`

---

## 🔒 Sécurité

- Mots de passe hashés avec **Argon2** (standard moderne, résistant aux attaques GPU)
- Validation des données d'entrée avec **class-validator**
- Guards NestJS pour protéger les routes sensibles
- Variables d'environnement pour les secrets

---

## 📝 Conformité aux Exigences du Projet

### ✅ Checklist

- [x] **Spécification du système** (texte + diagramme)
- [x] **Spécification OpenAPI complète** (\`specifications.yaml\`)
- [x] **Serveur Node.js conforme** (NestJS + MongoDB)
- [x] **README.md complet** avec :
  - [x] Spécification du système
  - [x] Instructions d'exécution
  - [x] Jeu de données expliqué
  - [x] Méthodologie suivie
- [x] **4-6 entités** dans le domaine métier (5 entités : User, Task, Badge, Challenge, Category)
- [x] **Données factices suffisantes** (5 utilisateurs, 16 tâches, 6 badges, 5 challenges)
- [x] **Toutes les méthodes HTTP** utilisées (GET, POST, PUT, DELETE, PATCH)
- [x] **Seed automatique** pour faciliter les tests par les correcteurs

### 🎁 Bonus Implémentés

- [x] **Base de données MongoDB** (alors que le sujet recommandait JSON en mémoire)
- [x] **Seed automatique** au démarrage (\`AUTO_SEED=true\`)
- [x] **Docker Compose** pour déploiement simplifié
- [x] **Documentation Swagger** interactive
- [x] **Validation des données** complète
- [x] **Architecture modulaire** NestJS professionnelle

---

## 🐳 Déploiement avec Docker

Le projet inclut un \`docker-compose.yml\` pour MongoDB :

\`\`\`yaml
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
\`\`\`

**Commandes Docker**

\`\`\`bash

# Démarrer MongoDB

docker-compose up -d

# Voir les logs

docker-compose logs -f

# Arrêter

docker-compose down

# Nettoyer complètement (supprime les données)

docker-compose down -v
\`\`\`

---

## 📄 Licence

Ce projet est développé dans un cadre pédagogique (IUT - R5.08).

---
