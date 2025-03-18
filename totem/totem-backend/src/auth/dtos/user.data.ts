import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UserInsertDTO {
    @ApiProperty()
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiProperty()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsBoolean()
    enabled: boolean;

    @ApiProperty()
    @IsBoolean()
    user: boolean;

    @ApiProperty()
    @IsBoolean()
    admin: boolean;

    @ApiProperty()
    @IsBoolean()
    operator: boolean;
}

export class UserAccountDTO {
    @ApiProperty()
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiProperty()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(6)
    newPassword?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(6)
    confirmPassword?: string;
}

export class UserLoginDTO {
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;
}

export class UserUpdateDTO extends PartialType(UserInsertDTO) {}

export class UserOutputDTO {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsBoolean()
    enabled: boolean;

    @ApiProperty()
    @IsBoolean()
    user: boolean;

    @ApiProperty()
    @IsBoolean()
    admin: boolean;

    @ApiProperty()
    @IsBoolean()
    operator: boolean;
}