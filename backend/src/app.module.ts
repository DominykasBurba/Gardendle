import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { PuzzlesModule} from './puzzles/puzzles.module';
import { UsersModule} from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ItemsModule, PuzzlesModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
