import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { CheckPolicies } from '../decorators/check-policies.decorator';
import { Action } from '../casl/types/action.enum';
import { Subject } from '../casl/types/subject.enum';
import { PoliciesGuard } from '../guards/policies.guard';

@Controller('media')
@UseGuards(PoliciesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, Subject.MEDIA))
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
