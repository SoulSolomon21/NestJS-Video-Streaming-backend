/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
  Put,
  Req,
  Res,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { Video } from '../model/video.schema';
import { VideoService } from '../service/video.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { request } from 'http';
import { response } from 'express';

@Controller('api/v1/video')
export class VideoController {
  constructor(private readonly VideoService: VideoService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  async createBook(
    @Res() response,
    @Req() request,
    @Body() video: Video,
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; cover?: Express.Multer.File[] },
  ) {
    const requestBody = {
      createdBy: request.user,
      title: video.title,
      video: files.video[0].filename,
      coverImage: files.cover[0].filename,
    };
    const newVideo = await this.VideoService.createVideo(requestBody);
    return response.status(HttpStatus.CREATED).json({
      newVideo,
    });
  }

  @Get()
  async read(@Query() id): Promise<object> {
    return await this.VideoService.readVideo(id);
  }

  @Get('/:id')
  async stream(@Param('id') id, @Res() response, @Req() request) {
    return this.VideoService.streamVideo(id, response, request);
  }

  @Put('/:id')
  async update(
    @Res() response,
    @Param('id') id,
    @Body() video: Video,
  ) {
    const updatedVideo = await this.VideoService.update(id, video);
    return response.status(HttpStatus.OK).json(updatedVideo);
  }

  @Delete('/:id')
  async delete(@Res() response, @Param('id') id) {
    await this.VideoService.delete(id);
    return response.status(HttpStatus.OK).json({
      user: null,
    });
  }
}
