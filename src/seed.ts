import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './database/seed.service';

async function seed() {
  console.log('🌱 Démarrage du processus de seed...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    // Check if database need to be clear before
    const args = process.argv.slice(2);
    if (args.includes('--clear')) {
      await seedService.clearDatabase();
    }

    await seedService.seedDatabase();
    console.log('\n✅ Seed terminé avec succès!');
  } catch (error) {
    console.error('\n❌ Erreur lors du seed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

void seed();
