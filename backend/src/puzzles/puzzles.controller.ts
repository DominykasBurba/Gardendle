import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { PuzzlesService } from './puzzles.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('puzzles')
export class PuzzlesController {
    constructor(private readonly puzzlesService : PuzzlesService) {}

    @Get('today')
    getPuzzleToday() {
        return this.puzzlesService.getPuzzleToday()
    }
    @Post('guess')
    async submitGuess(
        @Body('itemId') itemId: number,
        @Body('attemptToken') attemptToken?: string,
    ) {
        return this.puzzlesService.submitGuess(itemId, attemptToken);
    }

    @Get('leaderboard/today')
    getTodayLeaderboard() {
        return this.puzzlesService.getTodayLeaderboard();
    }

    @UseGuards(AuthGuard)
    @Post('result')
    saveResult(@Request() request, @Body('attemptToken') attemptToken: string) {
        return this.puzzlesService.saveResult(request.user.userId, attemptToken);
    }
}
