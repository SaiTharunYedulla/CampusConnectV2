import 'dotenv/config';
import app from './app';
import { config } from '@/config';
import prisma from '@/database/prisma';

async function bootstrap() {
  // Verify DB connection
  await prisma.$connect();
  console.log('✅ Database connected');

  const server = app.listen(config.PORT, () => {
    console.log(`🚀 CampusConnect API running on http://localhost:${config.PORT}`);
    console.log(`   Environment: ${config.NODE_ENV}`);
    console.log(`   Frontend:    ${config.FRONTEND_URL}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log('✅ Database disconnected. Goodbye.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});
