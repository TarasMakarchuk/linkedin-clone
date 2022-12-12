import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { join, extname } from 'path';
import { fromFile } from 'file-type';
import { from, Observable, of, switchMap } from 'rxjs';
import * as fs from 'fs';

type validFileExtension = 'png' | 'jpg' | 'jpeg' | 'gif';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg' | 'image/gif';

export const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg', 'gif'];
const validMimeTypes: validMimeType[] = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
];

export const imagesFolderPath = join(process.cwd(), 'assets', 'images');

export const saveImageToStorage = {
    storage: diskStorage({
        destination: imagesFolderPath,
        filename: (req, file, cb) => {
            const fileExtension: string = extname(file.originalname);
            const fileName: string = uuidv4() + fileExtension;
            cb(null, fileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        validMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
    },
};

export const isFileExtensionSafe = (filePath: string): Observable<boolean> => {
    return from(fromFile(filePath)).pipe(
        // @ts-ignore
        switchMap(
            (fileExtensionAndMimeType: {
                ext: validFileExtension;
                mime: validMimeType;
            }) => {
            if (!fileExtensionAndMimeType) return of(false);

            const isFileTypeLegit = validFileExtensions.includes(fileExtensionAndMimeType.ext);
            const isMimeTypeLegit = validMimeTypes.includes(fileExtensionAndMimeType.mime);
            const isFileLegit = isFileTypeLegit && isMimeTypeLegit;

            return of(isFileLegit);
        })
    )
};

export const removeFile = (filePath: string): void => {
    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error(error);
    }
};
