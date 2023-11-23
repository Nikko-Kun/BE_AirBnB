import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, Res, UseInterceptors, UploadedFiles, Put } from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FileUploadDto } from 'src/room/dto/upload.dto';
import { CreateLocationDto } from './dto/create-location.dto';

import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/user/entities/role.enum';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';


@ApiBearerAuth()

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("ViTri")
@Controller('api/')
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-all-location")
  getAllLocation(@Res() res: Response) {
    return this.locationService.getAllLocation(res)
  }

  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-loation-by-id/:locationID")
  getLocationById(@Param("locationID") locationID: number, @Res() res: Response) {
    return this.locationService.getLocationById(locationID, res)
  }

  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-panigation-location/:pageIndex/:pageSize")
  getPanigationLocation(
    @Param("pageIndex") pageIndex: number,
    @Param("pageSize") pageSize: number,
    @Res() res: Response
  ) {
    return this.locationService.getPanigationLocation(pageIndex, pageSize, res)
  }

  
  
  
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Post("post-location")
  postLocation(@Body() body: CreateLocationDto, @Res() res: Response) {
    return this.locationService.postLocation(body, res)
  }

  
  
  
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Post("upload-img-location/:locationID")
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
    @Param("locationID") locationID: number,
    @Body() body: FileUploadDto,
    @Res() res: Response) {

    return this.locationService.uploadImgRoom(files, body, locationID, res)
  }


  
  
  
  @HttpCode(201)
  @Roles(Role.ADMIN)
  @Put("put-location/:locationID")
  putLocation(
    @Param("locationID") locationID: number,
    @Body() body: CreateLocationDto,
    @Res() res: Response
  ) {
    return this.locationService.putLocation(locationID, body, res)
  }


  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete('delete-location/:locationID')
  deleteLocation(@Param("locationID") locationID: number, @Res() res:Response){
    return this.locationService.deleteLocation(locationID, res);
  }
}
