import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { errorCode, failCode, successCode } from 'src/Config/response';


import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

import { UserUpdateDto } from './dto/update-user.dto';
import { FileUploadDto } from './dto/upload.dto';
import { Response } from 'express';


@Injectable()
export class UserService {
  constructor() { }

  model = new PrismaClient();

  
  
  
  
  async getInforAllUser(res: Response) {
    try {
      let data = await this.model.nguoiDung.findMany({
        where: {
          isDelete: false
        }
      });

      if (data.length === 0) {
        return failCode(res, data, 400, "Chưa có người dùng nào được thêm vào dữ liệu!")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      
      errorCode(res, "Lỗi BE")
    }
  }
  

  
  
  
  async getInfoUserByUserId(userId: string, res: Response) {
    try {
      let data = await this.model.nguoiDung.findFirst({
        where: {
          nguoi_dung_id: +userId,
          isDelete: false
        }
      });

      if (data === null) {
        return failCode(res, data, 400, "Người dùng không tồn tại !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      
      errorCode(res, "Lỗi BE")
    }
  }
  

  
  
  
  async getListUserPanigation(pageIndex: number, pageSize: number, res: Response) {
    try{
      
      let index = (pageIndex - 1) * pageSize;  
      if (index < 0){
        return failCode(res, '', 400, "pageIndex phải lớn hơn 0 !")
      }

      let data = await this.model.nguoiDung.findMany({
        skip: +index,     
        take: +pageSize,  
        where: {
          isDelete: false,
        }
      });

      if (data.length === 0 ){
        return failCode(res, data, 400, "Không có dữ liệu !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception){
      
      errorCode(res, "Lỗi BE")
    }
  }


  
  
  
  async searchUserByName(userName: string, res: Response){
    try{
      let data = await this.model.nguoiDung.findMany({
        where:{
          ho_ten: {
            contains: userName      
          },
          isDelete: false
        }
      });

      if (data.length === 0){
        return failCode(res, data, 400, "Không có dữ liệu kết quả tìm kiếm !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception){
      
      errorCode(res, "Lỗi BE")
    }
  }


  
  
  
  async uploadImg(file: Express.Multer.File, userID: number, body: FileUploadDto, res: Response) {
    try {
      let { email } = body

      let checkUserID = await this.model.nguoiDung.findFirst({
        where: {
          nguoi_dung_id: +userID,
          email,
          isDelete: false
        },
      });

      if (checkUserID === null) {
        fs.unlink(process.cwd() + "/public/img/" + file.filename, (err) => {    
          if (err) {
            console.error("Error deleting file:", err);
          }
        });

        return failCode(res, '', 400, "Email hoặc ID người dùng không tồn tại !")
      }

      const createdImage = await this.model.nguoiDung.update({
        where: {
          nguoi_dung_id: +userID,
        },
        data: {
          anh_dai_dien: file.filename,
          
        }
      });

      successCode(res, file, 201, 'Thêm ảnh đại diện thành công !');
    }
    catch (exception) {
      
      errorCode(res, 'Lỗi BE !');
    }
  }


  
  
  
  async updateUserById(userId: string, body: UserUpdateDto, res: Response){
    try{ 
      let {ho_ten, email, mat_khau, so_dien_thoai, ngay_sinh, gioi_tinh, tuoi} = body;

      let checkEmail = await this.model.nguoiDung.findFirst({
        where: {
          nguoi_dung_id: +userId,
          isDelete: false
        }
      });

      if (checkEmail === null){
        return failCode(res, checkEmail, 400, "Email hoặc người dùng ID không đúng !")
      }

      let newData = await this.model.nguoiDung.update({
        where: {
          nguoi_dung_id: +userId
        },
        data: {
          ho_ten,
          email,
          mat_khau: await bcrypt.hash(mat_khau, 10), 
          so_dien_thoai,
          ngay_sinh,
          gioi_tinh,
          tuoi
        }
      });

      successCode(res, newData, 200, "Cập nhật thông tin thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE");
    }
  }


  
  
  
  async deleteUserById(userId: string, res: Response){
    try{
      let data = await this.model.nguoiDung.findFirst({
        where:{
          nguoi_dung_id: +userId,
          isDelete: false
        },
      });

      if (data === null){
        return failCode(res, data, 400, "Người dùng không tồn tại !")
      }

      await this.model.nguoiDung.update({
        where: {
          nguoi_dung_id: +userId,
        },
        data:{
          isDelete: true
        }
      });

      successCode(res, data, 200, "Đã xóa người dùng thành công !")
    }
    catch (exception){
      
      errorCode(res,"Lỗi BE")
    }
  }

}

