import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Request,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../services/user.service';
import { JwtGuard } from '../guards/jwt.guard';
import { map, Observable, of, switchMap } from 'rxjs';
import {
    imagesFolderPath,
    isFileExtensionSafe,
    removeFile,
    saveImageToStorage,
    validFileExtensions
} from '../helpers/image-storage';
import { join } from 'path';
import { UserEntity } from '../entity/user.entity';
import { FriendRequest, FriendRequestStatus } from '../entity/friend-request.interface';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
    ):  Observable<{ modifiedFileName: string } | { error: string }> {
        const fileName = file?.filename;
        if (!fileName) return of({ error: `File extension should be ${[...validFileExtensions].join(', ')}` });
        const imagePath = join(`${imagesFolderPath}/${fileName}`);

        return isFileExtensionSafe(imagePath).pipe(
            switchMap((isFileLegit: boolean) => {
                if (isFileLegit) {
                    const userId = req.user.id;
                    return this.userService.updateAvatarById(userId, fileName).pipe(
                        map(() => ({
                            modifiedFileName: file.filename
                        })),
                    );
                }
                removeFile(imagePath);
                return of({ error: `File content does not match extension` });
            })
        );
    };

    @UseGuards(JwtGuard)
    @Get('image')
    getImage(
        @Request() req,
        @Res() res
    ): Observable<Object> {
        const userId = req.user.id;
        return this.userService.findAvatarByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of(res.sendFile(imageName, { root: imagesFolderPath }))
            })
        );
    };

    @UseGuards(JwtGuard)
    @Get('image-name')
    getImageName(@Request() req): Observable<{ imageName: string }> {
        const { id } = req.user;
        return this.userService.findAvatarByUserId(id).pipe(
            switchMap((imageName: string) => {
                return of({ imageName });
            })
        );
    };

    @Get('image/:fileName')
    findImageByName(@Param('fileName') fileName: string, @Res() res) {
        if (!fileName || ['null', '[null]'].includes(fileName)) return;
        return res.sendFile(fileName, { root: imagesFolderPath });
    };

    @UseGuards(JwtGuard)
    @Get(':userId')
    findUserById(@Param('userId') userStringId: string): Observable<UserEntity> {
        const userId = parseInt(userStringId);
        return this.userService.findUserById(userId);
    };

    @UseGuards(JwtGuard)
    @Post('friend-request/send/:receiverId')
    sendFriendRequest(
        @Param('receiverId') receiverStringId: string,
        @Request() req,
    ): Observable<FriendRequest | { error: string }> {
        const receiverId = parseInt(receiverStringId);
        return this.userService.sendFriendRequest(receiverId, req.user);
    };

    @UseGuards(JwtGuard)
    @Get('friend-request/status/:receiverId')
    getFriendRequestStatus(
        @Param('receiverId') receiverStringId: string,
        @Request() req,
    ): Observable<FriendRequestStatus> {
        const receiverId = parseInt(receiverStringId);
        return this.userService.getFriendRequestStatus(receiverId, req.user);
    };

    @UseGuards(JwtGuard)
    @Put('friend-request/response/:requestId')
    respondToFriendRequest(
        @Param('requestId') requestStringId: string,
        @Body() statusResponse: FriendRequestStatus,
    ): Observable<FriendRequestStatus> {
        const requestId = parseInt(requestStringId);
        return this.userService.respondToFriendRequest(statusResponse.status, requestId);
    };

    @UseGuards(JwtGuard)
    @Get('friend-request/me/received-requests')
    getAllFriendRequestFromRecipients(
        @Request() req,
    ): Observable<FriendRequestStatus[]> {
        return this.userService.getAllFriendRequestFromRecipients(req.user);
    };
}
