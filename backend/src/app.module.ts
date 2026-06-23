import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { PuzzlesModule} from './puzzles/puzzles.module';
import { UsersModule} from './users/users.module';

@Module({
  imports: [ItemsModule, PuzzlesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
