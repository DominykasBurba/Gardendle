import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async getItems() {
    return this.prisma.item.findMany();
  }
  async getItemNames() {
    const items = await this.prisma.item.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return items.map((item) => ({
      itemId: item.id,
      itemName: item.name,
    }));
  }
}
