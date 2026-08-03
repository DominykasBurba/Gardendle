import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma.service';

type PuzzleAttempt = {
  kind: 'puzzle-attempt';
  attemptId: string;
  puzzleId: number;
  guesses: number;
  startedAt: string;
  completedAt: string | null;
};

@Injectable()
export class PuzzlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private getTodayStart() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return today;
  }

  private async getTodayPuzzleRecord() {
    return this.prisma.dailyPuzzle.findFirstOrThrow({
      where: { date: this.getTodayStart() },
      select: { id: true, itemId: true },
    });
  }

  private async readAttempt(attemptToken: string): Promise<PuzzleAttempt> {
    try {
      const attempt = await this.jwtService.verifyAsync<PuzzleAttempt>(attemptToken);

      if (attempt.kind !== 'puzzle-attempt') {
        throw new Error('Wrong token type');
      }

      return attempt;
    } catch {
      throw new BadRequestException('The puzzle attempt is invalid or expired.');
    }
  }

  async getPuzzles() {
    return this.prisma.dailyPuzzle.findMany({
        include: {
            item: true,
        },
    });
  }

  async getPuzzleToday() {
    const puzzle = await this.prisma.dailyPuzzle.findFirst({
      where: {
        date: this.getTodayStart(),
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

  async submitGuess(itemId: number, attemptToken?: string) {
    const puzzle = await this.getTodayPuzzleRecord();
    const now = new Date().toISOString();
    const previousAttempt = attemptToken
      ? await this.readAttempt(attemptToken)
      : null;

    if (previousAttempt && previousAttempt.puzzleId !== puzzle.id) {
      throw new BadRequestException('This attempt belongs to another puzzle.');
    }

    if (previousAttempt?.completedAt) {
      throw new BadRequestException('This puzzle attempt is already complete.');
    }

    const isCorrect = itemId === puzzle.itemId;
    const attempt: PuzzleAttempt = {
      kind: 'puzzle-attempt',
      attemptId: previousAttempt?.attemptId ?? randomUUID(),
      puzzleId: puzzle.id,
      guesses: (previousAttempt?.guesses ?? 0) + 1,
      startedAt: previousAttempt?.startedAt ?? now,
      completedAt: isCorrect ? now : null,
    };

    return {
      isCorrect,
      attemptToken: await this.jwtService.signAsync(attempt, { expiresIn: '2d' }),
    };
  }

  async saveResult(userId: number, attemptToken: string) {
    const attempt = await this.readAttempt(attemptToken);
    const puzzle = await this.getTodayPuzzleRecord();

    if (attempt.puzzleId !== puzzle.id || !attempt.completedAt) {
      throw new BadRequestException('Only a completed attempt for today can be saved.');
    }

    if (!attempt.attemptId) {
      throw new BadRequestException(
        'This attempt was created before score protection was enabled and cannot be claimed.',
      );
    }

    const claimedAttempt = await this.prisma.userResult.findUnique({
      where: { attemptId: attempt.attemptId },
    });

    if (claimedAttempt) {
      if (claimedAttempt.userId === userId) {
        return claimedAttempt;
      }

      throw new BadRequestException('This puzzle attempt has already been claimed.');
    }

    const existingResult = await this.prisma.userResult.findUnique({
      where: {
        userId_dailyPuzzleId: {
          userId,
          dailyPuzzleId: puzzle.id,
        },
      },
    });

    if (existingResult) {
      return existingResult;
    }

    return this.prisma.userResult.create({
      data: {
        attemptId: attempt.attemptId,
        userId,
        dailyPuzzleId: puzzle.id,
        guesses: attempt.guesses,
        startedAt: new Date(attempt.startedAt),
        completedAt: new Date(attempt.completedAt),
      },
    });
  }

  async getTodayLeaderboard() {
    const puzzle = await this.getTodayPuzzleRecord();
    const results = await this.prisma.userResult.findMany({
      where: {
        dailyPuzzleId: puzzle.id,
        completedAt: { not: null },
      },
      select: {
        id: true,
        guesses: true,
        startedAt: true,
        completedAt: true,
        user: { select: { username: true } },
      },
    });

    return results
      .map((result) => ({
        id: result.id,
        name: result.user.username,
        guesses: result.guesses,
        timeSeconds: result.startedAt && result.completedAt
          ? Math.max(0, Math.floor(
              (result.completedAt.getTime() - result.startedAt.getTime()) / 1000,
            ))
          : 0,
      }))
      .sort((a, b) => a.guesses - b.guesses || a.timeSeconds - b.timeSeconds)
      .slice(0, 10);
  }
}
