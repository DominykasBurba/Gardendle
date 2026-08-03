import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { PuzzlesService } from './puzzles.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SubmitGuessDTO } from './dto/submit-guess.dto';
import { SaveResultDTO } from './dto/save-result.dto';

@Controller('puzzles')
export class PuzzlesController {
    constructor(private readonly puzzlesService : PuzzlesService) {}

    @Get('today')
    getPuzzleToday() {
        return this.puzzlesService.getPuzzleToday()
    }
    @Post('guess')
    async submitGuess(@Body() submitGuessDTO: SubmitGuessDTO) {
        return this.puzzlesService.submitGuess(submitGuessDTO.itemId, submitGuessDTO.attemptToken);
    }

    @Get('leaderboard/today')
    getTodayLeaderboard() {
        return this.puzzlesService.getTodayLeaderboard();
    }

    @UseGuards(AuthGuard)
    @Post('result')
    saveResult(@Request() request, @Body() saveResultDTO: SaveResultDTO) {
        return this.puzzlesService.saveResult(request.user.userId, saveResultDTO.attemptToken);
    }
}
