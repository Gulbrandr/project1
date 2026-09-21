import { Controller, Get, Module } from '@nestjs/common';
import { cards, classes, contentVersion, enemies, loreChapters, packs } from '@adulting/content';

@Controller('content')
export class ContentController {
  @Get()
  bundle(): {
    version: string;
    cards: typeof cards;
    enemies: typeof enemies;
    classes: typeof classes;
    packs: typeof packs;
    lore: typeof loreChapters;
  } {
    return { version: contentVersion, cards, enemies, classes, packs, lore: loreChapters };
  }
}

@Module({ controllers: [ContentController] })
export class ContentModule {}
