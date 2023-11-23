import { Controller, Get, Post, Body, Param, Delete, HttpCode, Res, UseGuards, Put, UseInterceptors, UploadedFile, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserUpdateDto } from './dto/update-user.dto';
import { FileUploadDto } from './dto/upload.dto';

import { Role } from './entities/role.enum';
import { Roles } from '../decorators/roles.decorator';

import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Response } from 'express';


@ApiBearerAuth()      

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags("NguoiDung")
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Get("get-info-all-user")
  getInforAllUser(@Res() res: Response) {
    return this.userService.getInforAllUser(res)
  }

  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-info-user-by-user-id/:userId")
  getInfoUserByUserId(@Param("userId") userId: string, @Res() res: Response) {
    return this.userService.getInfoUserByUserId(userId, res)
  }

  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("get-list-user-panigation/:pageIndex/:pageSize")
  getListUserPanigation(
    @Param("pageIndex") pageIndex: number, 
    @Param("pageSize") pageSize: number,
    @Res() res: Response
  ) {
    return this.userService.getListUserPanigation(pageIndex, pageSize, res)
  }

  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Get("search-user-by-name/:userName")
  searchUserByName(@Param("userName") userName: string, @Res() res: Response){
    return this.userService.searchUserByName(userName, res)
  }


  
  
  
  @ApiConsumes('multipart/form-data')
  
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(201)
  @Post("upload-avatar/:userID")
  @UseInterceptors(FileInterceptor("hinhAnh",     
    {                                             
      storage: diskStorage({
        destination: process.cwd() + "/public/img",
        filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname) 
      })
    }
  ))    
  uploadImg(
    @UploadedFile() file: Express.Multer.File,
    @Param("userID") userID: number,
    @Body() body: FileUploadDto,
    @Res() res: Response) {

    return this.userService.uploadImg(file, userID, body, res)
  }


  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.USER)
  @Put("update-user/:userId")
  updateUserById(@Param("userId") userId: string, @Body() body: UserUpdateDto, @Res() res: Response){
    return this.userService.updateUserById(userId, body, res)
  }

  
  
  
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @Delete("delete-user/:userId")
  deleteUserById(@Param("userId") userId: string, @Res() res: Response){
    return this.userService.deleteUserById(userId, res)
  }



  
  
  
  
  
}
