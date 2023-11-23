import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDto {
    @ApiProperty()
    email: string

    @ApiProperty({ type: 'string', format: 'binary'}) 
    hinhAnh: any    
}                   
