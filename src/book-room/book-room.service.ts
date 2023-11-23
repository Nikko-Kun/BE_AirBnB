import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { errorCode, failCode, successCode } from 'src/Config/response';
import { CreateBookRoomDto } from './dto/create-book-room.dto';

@Injectable()
export class BookRoomService {
  constructor() {}

  model = new PrismaClient();

  async getAllInfoBookRoom(res: Response){
    try {
      let data = await this.model.datPhong.findMany({
        where: {
          isDelete: false
        }
      });

      if (data.length === 0){
        return failCode(res, data, 400, "Không có dữ liệu đặt phòng trống !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception){
      
      errorCode(res, "Lỗi BE")
    }
  };


  async getAllInfoBookRoomByUserId(userID:number, res: Response){
    try{
      let data = await this.model.nguoiDung.findFirst({
        where:{
          nguoi_dung_id: +userID,
          isDelete: false,
        },
        include: {
          DatPhong: true
        }
      });

      if (data === null){
        return failCode(res, '', 400, "Người dùng id không tồn tại")
      }

      if (data.DatPhong.length === 0){
        return failCode(res, '', 400, "Người dùng này chưa đặt phòng nào !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE !")
    }
  };


  async getAllInfoBookRoomByRoomId(roomID:number, res:Response){
    try {
      let data = await this.model.phong.findFirst({
        where: {
          phong_id: +roomID,
          isDelete: false
        },
        include: {
          DatPhong: true
        }
      });

      if (data === null){
        return failCode(res, '', 400, "ID phòng không hợp hệ !")
      }

      if (data.DatPhong.length === 0){
        return failCode(res, '', 400, "Phòng này không có dữ liệu do chưa có ai đặt !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception){
      
      errorCode(res, "Lỗi BE !")
    }
  }


  
  async postBookRoom(body: CreateBookRoomDto, res: Response){
    try{
      let {phong_id, nguoi_dung_id, ngay_den, ngay_di, so_luong_khach} = body;

      let checkUserID = await this.model.nguoiDung.findFirst({
        where:{
          nguoi_dung_id,
          isDelete: false
        }
      });

      let checkPhongID = await this.model.phong.findFirst({
        where:{
          phong_id,
          isDelete: false
        }
      });

      if (checkUserID === null){
        return failCode(res, '', 400, "Người dùng ID không tồn tại !")
      }

      if (checkPhongID === null){
        return failCode(res, '', 400, "Phòng ID không tồn tại !")
      }

      await this.model.datPhong.create({
        data: body
      })

      successCode(res, body, 201, "Đặt phòng thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE")
    }
  }


  
  async putBookRoomById(bookRoomID: number, body: CreateBookRoomDto, res: Response){
    try{
      let {phong_id, nguoi_dung_id, ngay_den, ngay_di, so_luong_khach} = body;

      let checkData = await this.model.datPhong.findFirst({
        where:{
          dat_phong_id: +bookRoomID,
          phong_id,
          nguoi_dung_id,
          isDelete: false
        }
      });


      if (checkData === null){
        return failCode(res, '', 400, "Dữ liệu không tồn tại hoặc chưa nhập đúng !")
      }

      await this.model.datPhong.update({
        where: {
          dat_phong_id: +bookRoomID,
          phong_id,
          nguoi_dung_id
        },
        data: {
          phong_id,
          nguoi_dung_id,
          ngay_den,
          ngay_di,
          so_luong_khach
        }
      });

      successCode(res, body, 200, "Sử thông tin đặt phòng thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE")
    }
  }


  
  async deleteBookRoomById(bookRoomID: number, res: Response){
    try{

      let checkBookRoom = await this.model.datPhong.findFirst({
        where:{
          dat_phong_id: +bookRoomID,
          isDelete: false
        }
      });


      if (checkBookRoom === null){
        return failCode(res, '', 400, "Đặt phòng ID không tồn tại hoặc đã bị xóa trước đó !")
      }

      await this.model.datPhong.update({
        where: {
          dat_phong_id: +bookRoomID,
        },
        data: {
          isDelete: true
        }
      });

      successCode(res, checkBookRoom, 200, "Xóa đặt phòng thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE")
    }
  }









}
