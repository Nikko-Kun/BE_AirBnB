import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { CreateRoomDto } from './dto/create-room.dto';
import { FileUploadDto } from '../room/dto/upload.dto';

import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/user/entities/role.enum';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@ApiBearerAuth()

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("Phong")
@Controller('api/')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-all-room")
  getAllRoom(@Res() res: Response) {
    return this.roomService.getAllRoom(res)
  }

  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-room-by-id/:roomID")
  getDetailRoomId(@Param("roomID") roomID: number, @Res() res: Response) {
    return this.roomService.getDetailRoomId(roomID, res)
  }

  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-list-room-by-location-id/:locationID")
  getListRoomByLocationId(@Param("locationID") locationID: number, @Res() res: Response) {
    return this.roomService.getListRoomByLocationId(locationID, res)
  }


  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-panigation-room/:pageIndex/:pageSize")
  getPanigationRoom(
    @Param("pageIndex") pageIndex: number,
    @Param("pageSize") pageSize: number,
    @Res() res: Response
  ) {
    return this.roomService.getPanigationRoom(pageIndex, pageSize, res)
  }

  
  
  
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Post("post-room")
  postRoom(@Body() body: CreateRoomDto, @Res() res: Response) {
    return this.roomService.postRoom(body, res)
  }


  
  
  
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Post("upload-img-room/:roomID")
  @UseInterceptors(
    FilesInterceptor("hinhAnh", 10,                
      {
        storage: diskStorage({
          destination: process.cwd() + "/public/img",
          filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname) 
        })
      }
    ))    
  uploadImgRoom(
    @UploadedFiles() files: Express.Multer.File[],
    @Param("roomID") roomID: number,
    @Body() body: FileUploadDto,
    @Res() res: Response) {

    return this.roomService.uploadImgRoom(files, body, roomID, res)
  }


  
  
  
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Put("put-room/:roomID")
  putRoom(@Param("roomID") roomID: number, @Body() body: CreateRoomDto, @Res() res: Response) {
    return this.roomService.putRoom(roomID, body, res)
  }


  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete("delete-room/:roomID")
  deleteRoom(@Param("roomID") roomID: number, @Res() res: Response) {
    return this.roomService.deleteRoom(roomID, res)
  }
}
