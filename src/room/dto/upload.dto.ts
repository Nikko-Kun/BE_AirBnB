import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDto {
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    hinhAnh: any[];    
}                   
