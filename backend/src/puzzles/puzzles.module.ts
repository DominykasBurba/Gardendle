import { Module } from '@nestjs/common';
import { PuzzlesController } from './puzzles.controller';
import { PuzzlesService } from './puzzles.service';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Module({
  controllers: [PuzzlesController],
  providers: [PuzzlesService, PrismaService, AuthGuard],
})
export class PuzzlesModule {}
