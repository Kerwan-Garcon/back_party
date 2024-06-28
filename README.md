# Optimisation des données

## Introduction

Ce document explique comment gérer les opérations de fetch batch, cache, pagination, et indexation des données en utilisant NestJS et Prisma. Ces pratiques sont essentielles pour optimiser les performances et la réactivité de votre application.

## Prérequis

- [Node.js](https://nodejs.org/) et [npm](https://www.npmjs.com/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)

## Installation

Installez les dépendances nécessaires :

```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/typeorm @prisma/client prisma
```

## Accéder a l'application

```bash
npm run start
```

## Swagger

🪧 baseurl/api pour accéder à swagger

## Configuration de Prisma

Configurez votre schéma Prisma (schema.prisma) pour inclure vos modèles. Par exemple :

```ts
model User {
id Int @id @default(autoincrement())
name String
ratingsGiven UserRating[] @relation("UserRatingsGiven")
ratingsReceived UserRating[] @relation("UserRatingsReceived")
}

model UserRating {
id Int @id @default(autoincrement())
rating Int
comment String
raterId Int
ratedId Int
createdAt DateTime @default(now())

rater User @relation("UserRatingsGiven", fields: [raterId], references: [id])
rated User @relation("UserRatingsReceived", fields: [ratedId], references: [id])

@@unique([raterId, ratedId])
@@index([raterId])
@@index([ratedId])
}

```

## Fetch Batch

Le fetch batch permet de réduire le nombre de requêtes en regroupant plusieurs fetch en une seule opération. NestJS et Prisma facilitent cela via les @PrismaClient et les requêtes relationnelles.

### Exemple de fetch batch :

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsersWithRatings() {
    return this.prisma.user.findMany({
      // include pour fusionner deux autre req 'select' en fonction des element passées.
      include: {
        ratingsGiven: true,
        ratingsReceived: true
      }
    });
  }
}
```

## Cache

Le cache améliore les performances en stockant les résultats fréquemment demandés. Utilisez des bibliothèques comme cache-manager avec NestJS.

### Installation de cache-manager :

```bash
npm install cache-manager
```

### Configuration du cache :

```ts
import { Module, CacheModule } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60, // seconds
      max: 100 // maximum number of items in cache
    })
  ],
  providers: [UserService]
})
export class UserModule {}
```

### Utilisation du cache dans un service :

```ts
import { Injectable, Cacheable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  @Cacheable()
  async getUser(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId }
    });
  }
}
```

### Activer le cache globalement

```ts
{
  provide: APP_INTERCEPTOR,
  useClass: CacheInterceptor,
}
```

## Pagination

La pagination permet de diviser les résultats en pages. Utilisez Prisma pour ajouter des arguments de pagination à vos requêtes.

### Exemple de pagination :

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(
    page: number,
    limit: number
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const total = await this.prisma.event.count();
    const data = await this.prisma.user.findMany({
      skip: skip,
      take: limit,
      include: {
        messagesSent: true,
        messagesReceived: true,
        location: true,
        events: true,
        ratingsReceived: true
      }
    });

    return {
      data: data,
      total: total,
      page: page,
      limit: limit
    };
  }
}
```

## Indexation

L'indexation améliore les performances de recherche dans la base de données. Prisma permet d'ajouter facilement des index via le schéma Prisma.

### Exemple d'indexation dans schema.prisma :

```ts
model UserRating {
id Int @id @default(autoincrement())
rating Int
comment String
raterId Int
ratedId Int
createdAt DateTime @default(now())

rater User @relation("UserRatingsGiven", fields: [raterId], references: [id])
rated User @relation("UserRatingsReceived", fields: [ratedId], references: [id])

@@unique([raterId, ratedId])
@@index([raterId])
@@index([ratedId])
}
```

## Conclusion

En suivant ces pratiques, vous pouvez optimiser les performances et la réactivité de votre application en utilisant NestJS et Prisma. Le fetch batch, le cache, la pagination et l'indexation sont des techniques essentielles pour gérer efficacement les données dans votre application.
