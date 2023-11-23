import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { errorCode, failCode, successCode } from 'src/Config/response';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/auth.dto';
import { UserSignUpType } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  model = new PrismaClient();

  async signIn(body: UserSignInDto, res: Response) {
    try {
      let { email, mat_khau } = body;

      let checkEmail = await this.model.nguoiDung.findFirst({
        where: {
          email,
        },
      });

      if (checkEmail) {
        
        let checkPass = bcrypt.compareSync(mat_khau, checkEmail.mat_khau);  
        if (checkPass == true) {
          
          let token = this.jwtService.sign({ data: checkEmail }, { expiresIn: '30d', secret: 'NODE' },); 
          successCode(res, token, 200, 'Login thành công !');
        } else {
          failCode(res, '', 400, 'Mật khẩu không đúng !');
        }
      } else {
        failCode(res, '', 400, 'Email không đúng hoặc chưa đăng ký !');
      }
    } catch (exception) {
      
      errorCode(res, 'Lỗi BE');
    }
  }

  
  async signUp(body: UserSignUpType, res: Response) {
    try {
      let { ho_ten, email, mat_khau, so_dien_thoai, ngay_sinh, anh_dai_dien, gioi_tinh, tuoi } = body;

      let checkEmail = await this.model.nguoiDung.findFirst({
        where: {
          email,
        },
      });

      if (checkEmail !== null) {
        return failCode(res, '', 400, 'Email đã tồn tại !');
      }

      
      let newData = {
        ho_ten,
        email,
        mat_khau: await bcrypt.hash(mat_khau, 10), 
        so_dien_thoai,
        ngay_sinh,
        anh_dai_dien,
        gioi_tinh,
        tuoi
      };

      await this.model.nguoiDung.create({
        data: newData,
      });

      successCode(res, newData, 201, 'Thêm mới thành công !');
    } catch (exception) {
      
      errorCode(res, 'Lỗi BE');
      
    }
  }
}