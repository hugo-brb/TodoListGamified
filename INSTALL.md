# 🚀 Guide d'Installation Rapide pour les Correcteurs

Ce guide permet de tester l'API en quelques minutes.

## Option 1 : Tout avec Docker (ULTRA-SIMPLE - RECOMMANDÉE)

### Prérequis

- Docker et Docker Compose uniquement

### Étapes (2 minutes)

```bash
# UNE SEULE COMMANDE suffit !
docker-compose up -d
```

**C'est tout !** L'application est accessible sur <http://localhost:3000>

La documentation Swagger est sur <http://localhost:3000/api>

### Pourquoi cette option ?

- ✅ Pas besoin d'installer Node.js
- ✅ Pas besoin de `npm install`
- ✅ MongoDB + Application démarrent ensemble
- ✅ Base de données remplie automatiquement

### Commandes utiles

```bash
# Voir les logs
docker-compose logs -f app

# Arrêter
docker-compose down

# Tout nettoyer
docker-compose down -v
```

## Option 2 : Développement Local (pour coder)

### Prérequis

- Node.js >= 18
- Docker et Docker Compose

### Étapes (5 minutes)

```bash
# 1. Installer les dépendances
npm install

# 2. Modifier .env pour utiliser localhost
# Changer MONGO_HOST=mongo en MONGO_HOST=localhost

# 3. Démarrer seulement MongoDB
docker-compose up -d mongo

# 4. Lancer l'application avec hot-reload
npm run start:dev
```

**Application accessible sur** <http://localhost:3000>

**Documentation Swagger sur** <http://localhost:3000/api>

## Option 3 : MongoDB local (sans Docker)

```bash
# 1. Modifier .env
MONGO_HOST=localhost

# 2. Installer et démarrer
npm install
npm run start:dev
```

## 🧪 Tester l'API

### 1. Via Swagger (Interface Web)

Ouvrir http://localhost:3000/api

### 2. Via Curl

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

## 📊 Données de Test

5 utilisateurs sont créés automatiquement :

- **admin@todo.com** / password123 (admin, level 5)
- **alice@example.com** / password123 (level 4)
- **bob@example.com** / password123 (level 3)
- **charlie@example.com** / password123 (level 2)
- **diana@example.com** / password123 (level 1)

Plus 16 tâches, 6 badges et 5 challenges prêts à tester.

## 🔄 Réinitialiser les Données

```bash
npm run seed:clear
```

## ❌ Problèmes Courants

### Le port 27017 est déjà utilisé

```bash
docker-compose down
docker-compose up -d
```

### La base est vide

Vérifier que `AUTO_SEED=true` dans `.env`, puis redémarrer :

```bash
npm run start:dev
```
