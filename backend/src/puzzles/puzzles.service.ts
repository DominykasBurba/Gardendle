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
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const puzzle = await this.prisma.dailyPuzzle.findFirst({
      where: {
        date: today,
      },
      include: {
        item: true,
      },
    });

    if (!puzzle) {
      return null;
    }

    return {
      id: puzzle.id,
      date: puzzle.date,
      difficulty: puzzle.difficulty,
      revealSeed: puzzle.revealSeed,
      imageUrl: puzzle.item.imageUrl,
      gridSize: puzzle.item.gridSize,
    };
  }
}
