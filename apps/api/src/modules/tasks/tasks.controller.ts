import { Body, Controller, Headers, Post } from '@nestjs/common';
import { syncPushSchema, type SyncPull } from '@adulting/shared';
import { TasksService } from './tasks.service';

@Controller('sync')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  // TODO(M3): replace the header with the auth guard once device auth lands.
  @Post()
  async sync(@Headers('x-user-id') userId: string, @Body() body: unknown): Promise<SyncPull> {
    const push = syncPushSchema.parse(body);
    return this.tasks.sync(userId, push);
  }
}
