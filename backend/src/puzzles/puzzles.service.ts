import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PuzzlesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPuzzles() {
    return this.prisma.dailyPuzzle.findMany({
        include: {
            item: true,
        },
    });
  }

  async getPuzzleToday() {
    return this.prisma.dailyPuzzle.findFirst({
        include: {
            item: true,
        },
    });
  }
}