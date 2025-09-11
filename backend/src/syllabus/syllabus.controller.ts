import { Controller, Get, Query } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';

@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Get()
  async getSyllabus(
    @Query('code') syllabusCode: string,
    @Query('catalog') catalogCode: string
  ) {
    return await this.syllabusService.getSyllabus(syllabusCode, catalogCode);
  }
}
