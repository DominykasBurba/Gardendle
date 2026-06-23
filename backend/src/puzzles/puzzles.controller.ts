import { Controller, Get } from '@nestjs/common';
import { PuzzlesService } from './puzzles.service';

@Controller('puzzles')
export class PuzzlesController {
    constructor(private readonly puzzlesService : PuzzlesService) {}

    @Get()
    getPuzzles() {
        return this.puzzlesService.getPuzzles();
    }
    @Get('today')
    getPuzzleToday() {
        return this.puzzlesService.getPuzzleToday()
    }
}