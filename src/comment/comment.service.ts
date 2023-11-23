import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import { successCode, failCode, errorCode } from 'src/Config/response';
import { CreateCommentDto } from './dto/create-comment.dto';


@Injectable()
export class CommentService {
  constructor() {}

  model = new PrismaClient();


  
  async getAllComment(res: Response){
    try{
      let data = await this.model.binhLuan.findMany({
        where:{
          isDelete: false,
        }
      });

      if(data.length === 0){
        return failCode(res, data, 400, "Chưa có dữ liệu bình luận nào được tìm thấy !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE !")
    }
  };


  
  async getCommentByUserId(userID:number, res: Response){
    try{
      let data = await this.model.nguoiDung.findFirst({
        where:{
          nguoi_dung_id: +userID,
          isDelete: false,
        },
        include: {
          BinhLuan: true
        }
      });

      if (data === null){
        return failCode(res, '', 400, "Người dùng id không tồn tại")
      }

      if (data.BinhLuan.length === 0){
        return failCode(res, '', 400, "Người dùng này chưa bình luận phòng nào !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE !")
    }
  };


  
  
  
  async getCommentByRoomId(roomID:number, res: Response){
    try{
      let data = await this.model.phong.findFirst({
        where:{
          phong_id: +roomID,
          isDelete: false
        },
        include: {
          BinhLuan: true
        }
      });

      if (data === null){
        return failCode(res, '', 400, "Phòng id không tồn tại")
      }

      if (data.BinhLuan.length === 0){
        return failCode(res, '', 400, "Chưa có ai bình luận phòng này !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE !")
    }
  };


  
  
  
  async postComment(body: CreateCommentDto, res: Response){
    try{
      let {phong_id, nguoi_dung_id, ngay_binh_luan, noi_dung, sao_binh_luan} = body;

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
        return failCode(res, '', 400, "Người dùng không tồn tại !")
      }

      if (checkPhongID === null){
        return failCode(res, '', 400, "Phòng ID không tồn tại !")
      }

      await this.model.binhLuan.create({
        data: body
      })

      successCode(res, body, 201, "Thêm bình luận thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE")
    }
  }


  
  
  
  async putComment(commentID: number, body: CreateCommentDto, res: Response){
    try{
      let {phong_id, nguoi_dung_id, ngay_binh_luan, noi_dung, sao_binh_luan} = body;

      let checkCmtID = await this.model.binhLuan.findFirst({
        where:{
          binh_luan_id: +commentID,
          phong_id,
          nguoi_dung_id,
          isDelete: false
        }
      });


      if (checkCmtID === null){
        return failCode(res, '', 400, "Dữ liệu không tồn tại hoặc chưa nhập đúng !")
      }

      await this.model.binhLuan.update({
        where: {
          binh_luan_id: +commentID,
          phong_id,
          nguoi_dung_id
        },
        data: {
          phong_id,
          nguoi_dung_id,
          ngay_binh_luan,
          noi_dung,
          sao_binh_luan
        }
      });

      successCode(res, body, 200, "Cập nhật bình luận thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE")
    }
  }


  
  
  
  async deleteComment(commentID: number, res: Response){
    try{

      let checkCmtID = await this.model.binhLuan.findFirst({
        where:{
          binh_luan_id: +commentID,
          isDelete: false
        }
      });


      if (checkCmtID === null){
        return failCode(res, '', 400, "Comment ID không tồn tại !")
      }

      await this.model.binhLuan.update({
        where: {
          binh_luan_id: +commentID,
        },
        data: {
          isDelete: true
        }
      });

      successCode(res, checkCmtID, 200, "Xóa bình luận thành công !")
    }
    catch(exception){
      
      errorCode(res, "Lỗi BE")
    }
  }





}
