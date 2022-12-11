import { Controller, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../services/user.service';
import { JwtGuard } from '../guards/jwt.guard';
import { Observable, of, switchMap } from 'rxjs';
import {
    imagesFolderPath,
    isFileExtensionSafe,
    removeFile,
    saveImageToStorage,
    validFileExtensions
} from '../helpers/image-storage';
import { join } from 'path';
import { UpdateResult } from "typeorm";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
    ):  Observable<UpdateResult | { error: string }> {
        const fileName = file?.filename;
        if (!fileName) return of({ error: `File extension should be ${[...validFileExtensions].join(', ')}` });
        const imagePath = join(`${imagesFolderPath}/${fileName}`);

        return isFileExtensionSafe(imagePath).pipe(
            switchMap((isFileLegit: boolean) => {
                if (isFileLegit) {
                    const userId = req.user.id;
                    return this.userService.updateAvatarById(userId, fileName);
                }
                removeFile(imagePath);
                return of({ error: `File content does not match extension`});
            })
        );
    };
}
