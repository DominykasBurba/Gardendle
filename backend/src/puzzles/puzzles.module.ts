import { Module } from '@nestjs/common';
import { PuzzlesController } from './puzzles.controller';
import { PuzzlesService } from './puzzles.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PuzzlesController],
  providers: [PuzzlesService, PrismaService],
})
export class PuzzlesModule {}